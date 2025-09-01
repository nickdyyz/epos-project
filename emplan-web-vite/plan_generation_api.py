#!/usr/bin/env python3
"""
plan_generation_api.py - Flask API for emergency plan generation

This API provides endpoints for generating emergency plans using the local model.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os
import json
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from datetime import datetime
from pathlib import Path
import subprocess
import tempfile
import markdown
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from PyPDF2 import PdfWriter, PdfReader
from io import BytesIO

# Add the parent directory to the path so we can import the emergency_plan_generator
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from plan_queue_system import plan_queue

# Initialize the queue system
plan_queue.start_processing()

@app.route('/api/generate-plan', methods=['POST'])
def generate_plan():
    """Queue a plan generation task for asynchronous processing."""
    try:
        # Get form data from request
        form_data = request.json
        
        if not form_data:
            return jsonify({'error': 'No form data provided'}), 400
        
        # Transform form data to match the generator's expected format
        plan_inputs = {
            'organization_name': form_data.get('organization_name', ''),
            'organization_type': form_data.get('organization_type', ''),
            'location': form_data.get('location', ''),
            'building_size': 'Medium (50-200 people)',  # Default, could be added to form
            'primary_hazards': form_data.get('primary_hazards', []),
            'special_considerations': form_data.get('special_considerations', []),
            'has_security': True,  # Default, could be added to form
            'has_medical_staff': False,  # Default, could be added to form
            'emergency_equipment': ['Fire Extinguishers', 'First Aid Kits', 'Emergency Lighting'],  # Default
            'communication_methods': ['PA System', 'Email Alerts', 'Text/SMS'],  # Default
            'plan_scope': form_data.get('scope', 'Comprehensive (All Hazards)'),
            'additional_requirements': form_data.get('additional_requirements', ''),
            'pdf_password': form_data.get('pdf_password', '')  # Get password from form
        }
        
        # Validate required fields
        required_fields = ['organization_name', 'organization_type', 'location']
        for field in required_fields:
            if not plan_inputs[field]:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        if not plan_inputs['primary_hazards']:
            return jsonify({'error': 'At least one hazard must be selected'}), 400
        
        # Validate PDF password
        if not plan_inputs['pdf_password']:
            return jsonify({'error': 'PDF password is required'}), 400
        
        # Validate password strength
        password = plan_inputs['pdf_password']
        if len(password) < 8:
            return jsonify({'error': 'Password must be at least 8 characters long'}), 400
        if not any(c.islower() for c in password):
            return jsonify({'error': 'Password must contain at least one lowercase letter'}), 400
        if not any(c.isupper() for c in password):
            return jsonify({'error': 'Password must contain at least one uppercase letter'}), 400
        if not any(c.isdigit() for c in password):
            return jsonify({'error': 'Password must contain at least one number'}), 400
        if not any(c in '!@#$%^&*()_+-=[]{}|;:,.<>?' for c in password):
            return jsonify({'error': 'Password must contain at least one special character'}), 400
        
        # Get user email from form data or use a default
        user_email = form_data.get('primary_contact_email', 'user@example.com')
        
        # Add task to queue
        task_id = plan_queue.add_task(
            user_email=user_email,
            organization_name=plan_inputs['organization_name'],
            plan_inputs=plan_inputs
        )
        
        # Return immediate response with task ID
        response = {
            'success': True,
            'message': 'Your plan has been queued for generation. You will receive an email when it is ready.',
            'task_id': task_id,
            'status': 'queued',
            'organization_name': plan_inputs['organization_name']
        }
        
        return jsonify(response)
        
    except Exception as e:
        print(f"Error queuing plan generation: {str(e)}")
        return jsonify({'error': f'Failed to queue plan generation: {str(e)}'}), 500

@app.route('/api/task-status/<task_id>', methods=['GET'])
def get_task_status(task_id):
    """Get the status of a plan generation task."""
    try:
        task = plan_queue.get_task_status(task_id)
        if not task:
            return jsonify({'error': 'Task not found'}), 404
        
        return jsonify({
            'success': True,
            'task': task
        })
        
    except Exception as e:
        print(f"Error getting task status: {str(e)}")
        return jsonify({'error': f'Failed to get task status: {str(e)}'}), 500

@app.route('/api/send-notification', methods=['POST'])
def send_notification():
    """Send a notification email using AWS SES"""
    try:
        data = request.json
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        required_fields = ['to_email', 'subject', 'body']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Send notification email
        success = plan_queue.send_notification_email(
            to_email=data['to_email'],
            subject=data['subject'],
            body=data['body']
        )
        
        if success:
            return jsonify({
                'success': True,
                'message': 'Notification email sent successfully'
            })
        else:
            return jsonify({'error': 'Failed to send notification email'}), 500
        
    except Exception as e:
        print(f"Error sending notification: {str(e)}")
        return jsonify({'error': f'Failed to send notification: {str(e)}'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'model': generator.model_name
    })

@app.route('/api/plans', methods=['GET'])
def list_plans():
    """List all generated plans."""
    try:
        plans_dir = Path('../generated_plans')
        if not plans_dir.exists():
            return jsonify({'plans': []})
        
        plans = []
        for plan_file in plans_dir.glob('*.md'):
            try:
                # Extract basic info from filename
                filename = plan_file.name
                if filename.startswith('emergency_plan_') and filename.endswith('.md'):
                    # Parse organization name from filename
                    org_name = filename.replace('emergency_plan_', '').replace('.md', '')
                    org_name = org_name.replace('_', ' ').replace('20250720', '').replace('134839', '').replace('102711', '')
                    org_name = org_name.strip()
                    
                    plans.append({
                        'filename': filename,
                        'organization_name': org_name,
                        'filepath': str(plan_file),
                        'created_at': datetime.fromtimestamp(plan_file.stat().st_mtime).isoformat(),
                        'size': plan_file.stat().st_size
                    })
            except Exception as e:
                print(f"Error reading plan file {plan_file}: {e}")
                continue
        
        # Sort by creation date (newest first)
        plans.sort(key=lambda x: x['created_at'], reverse=True)
        
        return jsonify({'plans': plans})
        
    except Exception as e:
        print(f"Error listing plans: {e}")
        return jsonify({'error': f'Failed to list plans: {str(e)}'}), 500

@app.route('/api/plans/<filename>', methods=['GET'])
def get_plan(filename):
    """Get a specific plan by filename."""
    try:
        plan_file = Path('../generated_plans') / filename
        
        if not plan_file.exists():
            return jsonify({'error': 'Plan not found'}), 404
        
        with open(plan_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        return jsonify({
            'filename': filename,
            'content': content,
            'filepath': str(plan_file)
        })
        
    except Exception as e:
        print(f"Error reading plan {filename}: {e}")
        return jsonify({'error': f'Failed to read plan: {str(e)}'}), 500

def create_pdf_from_markdown(content, password, plan_title):
    """Create a password-protected PDF from markdown content."""
    try:
        # Convert markdown to HTML first
        html_content = markdown.markdown(content, extensions=['extra'])
        
        # Create a temporary PDF file
        with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as pdf_file:
            pdf_temp_path = pdf_file.name
        
        # Create PDF using ReportLab
        doc = SimpleDocTemplate(pdf_temp_path, pagesize=letter)
        story = []
        
        # Get styles
        styles = getSampleStyleSheet()
        
        # Create custom styles
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            textColor=HexColor('#2c3e50'),
            alignment=1  # Center alignment
        )
        
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=16,
            spaceAfter=12,
            spaceBefore=20,
            textColor=HexColor('#34495e')
        )
        
        subheading_style = ParagraphStyle(
            'CustomSubHeading',
            parent=styles['Heading3'],
            fontSize=14,
            spaceAfter=8,
            spaceBefore=12,
            textColor=HexColor('#7f8c8d')
        )
        
        normal_style = ParagraphStyle(
            'CustomNormal',
            parent=styles['Normal'],
            fontSize=11,
            spaceAfter=6,
            leading=14
        )
        
        # Add header
        header_text = f"""
        <para align="center">
        <font size="24" color="#2c3e50"><b>Emergency Plan</b></font><br/>
        <font size="16" color="#34495e"><b>{plan_title}</b></font><br/>
        <font size="12" color="#7f8c8d">Generated by EPOS (Emergency Plan Operating System)</font>
        </para>
        """
        story.append(Paragraph(header_text, styles['Normal']))
        story.append(Spacer(1, 20))
        
        # Process the HTML content and convert to PDF elements
        lines = html_content.split('\n')
        current_text = ""
        
        for line in lines:
            line = line.strip()
            if not line:
                if current_text:
                    # Convert HTML tags to ReportLab format
                    formatted_text = current_text.replace('<strong>', '<b>').replace('</strong>', '</b>')
                    formatted_text = formatted_text.replace('<em>', '<i>').replace('</em>', '</i>')
                    formatted_text = formatted_text.replace('<ul>', '').replace('</ul>', '')
                    formatted_text = formatted_text.replace('<ol>', '').replace('</ol>', '')
                    formatted_text = formatted_text.replace('<li>', '• ').replace('</li>', '<br/>')
                    
                    story.append(Paragraph(formatted_text, normal_style))
                    current_text = ""
                story.append(Spacer(1, 6))
            elif line.startswith('<h1>'):
                if current_text:
                    story.append(Paragraph(current_text, normal_style))
                    current_text = ""
                title = line.replace('<h1>', '').replace('</h1>', '')
                story.append(Paragraph(title, title_style))
            elif line.startswith('<h2>'):
                if current_text:
                    story.append(Paragraph(current_text, normal_style))
                    current_text = ""
                heading = line.replace('<h2>', '').replace('</h2>', '')
                story.append(Paragraph(heading, heading_style))
            elif line.startswith('<h3>'):
                if current_text:
                    story.append(Paragraph(current_text, normal_style))
                    current_text = ""
                subheading = line.replace('<h3>', '').replace('</h3>', '')
                story.append(Paragraph(subheading, subheading_style))
            else:
                if current_text:
                    current_text += " " + line
                else:
                    current_text = line
        
        # Add any remaining text
        if current_text:
            formatted_text = current_text.replace('<strong>', '<b>').replace('</strong>', '</b>')
            formatted_text = formatted_text.replace('<em>', '<i>').replace('</em>', '</i>')
            story.append(Paragraph(formatted_text, normal_style))
        
        # Add footer
        story.append(Spacer(1, 30))
        footer_text = f"""
        <para align="center">
        <font size="10" color="#7f8c8d">
        This document is password protected.<br/>
        Generated on {datetime.now().strftime('%B %d, %Y at %I:%M %p')}
        </font>
        </para>
        """
        story.append(Paragraph(footer_text, styles['Normal']))
        
        # Build the PDF
        doc.build(story)
        
        # Now add password protection using PyPDF2
        reader = PdfReader(pdf_temp_path)
        writer = PdfWriter()
        
        # Add all pages to the writer
        for page in reader.pages:
            writer.add_page(page)
        
        # Add password protection
        writer.encrypt(password)
        
        # Write the encrypted PDF
        with open(pdf_temp_path, 'wb') as output_file:
            writer.write(output_file)
        
        return pdf_temp_path
        
    except Exception as e:
        print(f"Error creating PDF: {e}")
        return None

def send_email_with_pdf(to_email, password, plan_title, pdf_path):
    """Send email with password-protected PDF attachment."""
    try:
        # Email configuration (you'll need to set up your own SMTP settings)
        smtp_server = "smtp.gmail.com"  # Change to your SMTP server
        smtp_port = 587
        sender_email = "your-email@gmail.com"  # Change to your email
        sender_password = "your-app-password"  # Change to your app password
        
        # Create message
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = to_email
        msg['Subject'] = f"Emergency Plan: {plan_title}"
        
        # Email body
        body = f"""
        Hello,
        
        Your emergency plan "{plan_title}" has been generated and is attached to this email.
        
        The PDF file is password protected for security.
        Password: {password}
        
        Please keep this password secure and do not share it with unauthorized individuals.
        
        If you have any questions about your emergency plan, please contact us.
        
        Best regards,
        EPOS Team
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        # Attach PDF file
        if pdf_path and os.path.exists(pdf_path):
            with open(pdf_path, "rb") as attachment:
                part = MIMEBase('application', 'pdf')
                part.set_payload(attachment.read())
            
            encoders.encode_base64(part)
            part.add_header(
                'Content-Disposition',
                f'attachment; filename= {plan_title.replace(" ", "_")}_Emergency_Plan.pdf'
            )
            msg.attach(part)
        
        # Send email
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_password)
        text = msg.as_string()
        server.sendmail(sender_email, to_email, text)
        server.quit()
        
        return True
        
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

@app.route('/api/send-plan-email', methods=['POST'])
def send_plan_email():
    """Send a password-protected PDF of the plan via email."""
    try:
        data = request.json
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        email = data.get('email')
        password = data.get('password')
        plan_id = data.get('planId')
        plan_title = data.get('planTitle')
        
        if not all([email, password, plan_title]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # For now, we'll use a sample plan content
        # In a real implementation, you'd fetch the plan content from your database
        sample_content = f"""
# {plan_title}

## Executive Summary

This emergency plan has been generated for your organization to ensure safety and preparedness in emergency situations.

## Emergency Contacts

- **Emergency Coordinator:** [Contact Information]
- **Safety Manager:** [Contact Information]
- **Facility Manager:** [Contact Information]

## Emergency Procedures

### Fire Emergency
1. Activate nearest fire alarm
2. Call 911 immediately
3. Evacuate using designated routes
4. Do not use elevators

### Medical Emergency
1. Call 911 immediately
2. Provide first aid if trained
3. Contact emergency coordinator
4. Document incident

### Severe Weather
1. Monitor weather alerts
2. Move to designated shelter areas
3. Stay away from windows
4. Follow evacuation orders if necessary

## Communication Protocols

- Emergency notification system
- Designated floor wardens
- Regular safety meetings
- Client notification procedures

## Recovery Procedures

- Business continuity planning
- Data backup and recovery
- Employee support services
- Return-to-work procedures

## Training and Drills

- Quarterly emergency drills
- Annual safety training
- New employee orientation
- Regular plan reviews

This plan should be reviewed and updated annually or whenever significant changes occur in the organization or facility.

---
Generated by EPOS (Emergency Plan Operating System)
Password: {password}
Generated on: {datetime.now().strftime('%B %d, %Y at %I:%M %p')}
        """
        
        # Create PDF (for now, HTML file)
        pdf_path = create_pdf_from_markdown(sample_content, password)
        
        if not pdf_path:
            return jsonify({'error': 'Failed to create PDF'}), 500
        
        # Send email
        email_sent = send_email_with_pdf(email, password, plan_title, pdf_path)
        
        # Clean up temporary file
        try:
            os.unlink(pdf_path)
        except:
            pass
        
        if email_sent:
            return jsonify({
                'success': True,
                'message': f'Plan sent successfully to {email}',
                'password': password
            })
        else:
            return jsonify({'error': 'Failed to send email'}), 500
        
    except Exception as e:
        print(f"Error in send_plan_email: {e}")
        return jsonify({'error': f'Failed to send plan email: {str(e)}'}), 500

@app.route('/api/download-pdf', methods=['POST'])
def download_pdf():
    """Generate and download a password-protected PDF of the plan."""
    try:
        data = request.json
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        content = data.get('content')
        password = data.get('password')
        plan_title = data.get('planTitle', 'Emergency Plan')
        
        if not content or not password:
            return jsonify({'error': 'Missing content or password'}), 400
        
        # Generate the PDF
        pdf_path = create_pdf_from_markdown(content, password)
        
        if not pdf_path or not os.path.exists(pdf_path):
            return jsonify({'error': 'Failed to generate PDF'}), 500
        
        # Read the PDF file
        with open(pdf_path, 'rb') as pdf_file:
            pdf_data = pdf_file.read()
        
        # Clean up the temporary file
        try:
            os.unlink(pdf_path)
        except:
            pass
        
        # Return the PDF as a download
        from flask import send_file
        from io import BytesIO
        
        return send_file(
            BytesIO(pdf_data),
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f"{plan_title.replace(' ', '_')}_Emergency_Plan.pdf"
        )
        
    except Exception as e:
        print(f"Error downloading PDF: {e}")
        return jsonify({'error': f'Failed to download PDF: {str(e)}'}), 500

if __name__ == '__main__':
    print("🚨 EPOS Emergency Plan Generation API")
    print("=" * 50)
    print(f"Model: {generator.model_name}")
    print(f"Context documents loaded: {len(generator.context_documents)}")
    print("Starting API server on http://localhost:5002")
    print("=" * 50)
    
    app.run(debug=True, host='0.0.0.0', port=5002) 