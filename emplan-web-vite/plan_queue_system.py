import os
import json
import uuid
import time
import threading
import sqlite3
import boto3
from botocore.exceptions import ClientError
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from datetime import datetime
from typing import Dict, List, Optional
from enum import Enum

class TaskStatus(Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class PlanQueueSystem:
    def __init__(self, db_path: str = "plan_queue.db"):
        self.db_path = db_path
        self.processing_thread = None
        self.should_stop = False
        self._init_database()
        
        # Email configuration for AWS SES
        self.email_config = {
            'from_email': 'training@lesconsulting.org',
            'from_name': 'EPOS Emergency Plan System',
            'reply_to': 'training@lesconsulting.org'
        }
        
        # Initialize AWS SES client
        self.ses_client = boto3.client('ses', region_name='us-east-1')
        
        # Verify SES configuration
        self._verify_ses_config()
        
    def _init_database(self):
        """Initialize the SQLite database for storing queue tasks"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS plan_tasks (
                task_id TEXT PRIMARY KEY,
                user_email TEXT NOT NULL,
                organization_name TEXT NOT NULL,
                plan_inputs TEXT NOT NULL,
                status TEXT NOT NULL,
                created_at TEXT NOT NULL,
                started_at TEXT,
                completed_at TEXT,
                error_message TEXT,
                plan_content TEXT,
                pdf_path TEXT
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def add_task(self, user_email: str, organization_name: str, plan_inputs: Dict) -> str:
        """Add a new plan generation task to the queue"""
        task_id = str(uuid.uuid4())
        
        # Store in database
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO plan_tasks 
            (task_id, user_email, organization_name, plan_inputs, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            task_id,
            user_email,
            organization_name,
            json.dumps(plan_inputs),
            TaskStatus.PENDING.value,
            datetime.now().isoformat()
        ))
        
        conn.commit()
        conn.close()
        
        print(f"Task {task_id} added to queue for {organization_name}")
        return task_id
    
    def get_task_status(self, task_id: str) -> Optional[Dict]:
        """Get the status of a specific task"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM plan_tasks WHERE task_id = ?
        ''', (task_id,))
        
        row = cursor.fetchone()
        conn.close()
        
        if row:
            return {
                'task_id': row[0],
                'user_email': row[1],
                'organization_name': row[2],
                'plan_inputs': json.loads(row[3]),
                'status': row[4],
                'created_at': row[5],
                'started_at': row[6],
                'completed_at': row[7],
                'error_message': row[8],
                'plan_content': row[9],
                'pdf_path': row[10]
            }
        return None
    
    def get_pending_tasks(self) -> List[Dict]:
        """Get all pending tasks ordered by creation time"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM plan_tasks 
            WHERE status = ? 
            ORDER BY created_at ASC
        ''', (TaskStatus.PENDING.value,))
        
        rows = cursor.fetchall()
        conn.close()
        
        tasks = []
        for row in rows:
            tasks.append({
                'task_id': row[0],
                'user_email': row[1],
                'organization_name': row[2],
                'plan_inputs': json.loads(row[3]),
                'status': row[4],
                'created_at': row[5],
                'started_at': row[6],
                'completed_at': row[7],
                'error_message': row[8],
                'plan_content': row[9],
                'pdf_path': row[10]
            })
        
        return tasks
    
    def update_task_status(self, task_id: str, status: TaskStatus, **kwargs):
        """Update the status of a task"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        update_fields = ['status = ?']
        values = [status.value]
        
        if 'started_at' in kwargs:
            update_fields.append('started_at = ?')
            values.append(kwargs['started_at'].isoformat())
        
        if 'completed_at' in kwargs:
            update_fields.append('completed_at = ?')
            values.append(kwargs['completed_at'].isoformat())
        
        if 'error_message' in kwargs:
            update_fields.append('error_message = ?')
            values.append(kwargs['error_message'])
        
        if 'plan_content' in kwargs:
            update_fields.append('plan_content = ?')
            values.append(kwargs['plan_content'])
        
        if 'pdf_path' in kwargs:
            update_fields.append('pdf_path = ?')
            values.append(kwargs['pdf_path'])
        
        values.append(task_id)
        
        cursor.execute(f'''
            UPDATE plan_tasks 
            SET {', '.join(update_fields)}
            WHERE task_id = ?
        ''', values)
        
        conn.commit()
        conn.close()
    
    def _verify_ses_config(self):
        """Verify AWS SES configuration and email verification status"""
        try:
            # Check if the from email is verified
            response = self.ses_client.get_send_quota()
            print(f"AWS SES Quota: {response['MaxSendRate']} emails per second, {response['Max24HourSend']} emails per day")
            
            # Check verification status of the from email
            try:
                response = self.ses_client.get_identity_verification_attributes(
                    Identities=[self.email_config['from_email']]
                )
                
                if self.email_config['from_email'] in response['VerificationAttributes']:
                    status = response['VerificationAttributes'][self.email_config['from_email']]['VerificationStatus']
                    if status == 'Success':
                        print(f"✅ Email {self.email_config['from_email']} is verified in AWS SES")
                    else:
                        print(f"⚠️ Email {self.email_config['from_email']} verification status: {status}")
                else:
                    print(f"❌ Email {self.email_config['from_email']} not found in SES verification attributes")
                    
            except ClientError as e:
                print(f"⚠️ Could not verify email status: {str(e)}")
                
        except ClientError as e:
            print(f"❌ AWS SES configuration error: {str(e)}")
            print("Please ensure AWS credentials are properly configured and SES permissions are granted")
        except Exception as e:
            print(f"❌ Unexpected error verifying SES config: {str(e)}")
    
    def send_plan_email(self, task: Dict, pdf_path: str) -> bool:
        """Send the completed plan via email using AWS SES"""
        try:
            # Create email message
            msg = MIMEMultipart()
            msg['From'] = f"{self.email_config['from_name']} <{self.email_config['from_email']}>"
            msg['To'] = task['user_email']
            msg['Reply-To'] = self.email_config['reply_to']
            msg['Subject'] = f"Your Emergency Plan for {task['organization_name']} is Ready"
            
            # Email body
            body = f"""
Dear User,

Your emergency plan for {task['organization_name']} has been successfully generated and is ready for download.

IMPORTANT: Please remember or securely save the password you used to protect the PDF file. 
This password cannot be recovered if lost.

Plan Details:
- Organization: {task['organization_name']}
- Generated: {task['completed_at']}
- Status: Ready for download

The password-protected PDF is attached to this email.

If you have any questions or need assistance, please reply to this email.

Best regards,
EPOS Emergency Plan System
            """
            
            msg.attach(MIMEText(body, 'plain'))
            
            # Attach PDF
            with open(pdf_path, 'rb') as attachment:
                part = MIMEBase('application', 'octet-stream')
                part.set_payload(attachment.read())
            
            encoders.encode_base64(part)
            part.add_header(
                'Content-Disposition',
                f'attachment; filename=emergency_plan_{task["organization_name"].replace(" ", "_")}.pdf'
            )
            msg.attach(part)
            
            # Send email using AWS SES
            response = self.ses_client.send_raw_email(
                Source=self.email_config['from_email'],
                Destinations=[task['user_email']],
                RawMessage={'Data': msg.as_string()}
            )
            
            print(f"Email sent successfully to {task['user_email']} via AWS SES. Message ID: {response['MessageId']}")
            return True
            
        except ClientError as e:
            print(f"Failed to send email to {task['user_email']} via AWS SES: {str(e)}")
            return False
        except Exception as e:
            print(f"Unexpected error sending email to {task['user_email']}: {str(e)}")
            return False
    
    def send_notification_email(self, to_email: str, subject: str, body: str) -> bool:
        """Send a notification email using AWS SES"""
        try:
            # Create email message
            msg = MIMEMultipart()
            msg['From'] = f"{self.email_config['from_name']} <{self.email_config['from_email']}>"
            msg['To'] = to_email
            msg['Reply-To'] = self.email_config['reply_to']
            msg['Subject'] = subject
            
            msg.attach(MIMEText(body, 'plain'))
            
            # Send email using AWS SES
            response = self.ses_client.send_raw_email(
                Source=self.email_config['from_email'],
                Destinations=[to_email],
                RawMessage={'Data': msg.as_string()}
            )
            
            print(f"Notification email sent successfully to {to_email} via AWS SES. Message ID: {response['MessageId']}")
            return True
            
        except ClientError as e:
            print(f"Failed to send notification email to {to_email} via AWS SES: {str(e)}")
            return False
        except Exception as e:
            print(f"Unexpected error sending notification email to {to_email}: {str(e)}")
            return False
    
    def start_processing(self):
        """Start the background processing thread"""
        if self.processing_thread and self.processing_thread.is_alive():
            print("Processing thread already running")
            return
        
        self.should_stop = False
        self.processing_thread = threading.Thread(target=self._process_queue)
        self.processing_thread.daemon = True
        self.processing_thread.start()
        print("Plan queue processing started")
    
    def stop_processing(self):
        """Stop the background processing thread"""
        self.should_stop = True
        if self.processing_thread:
            self.processing_thread.join(timeout=5)
        print("Plan queue processing stopped")
    
    def _process_queue(self):
        """Background thread that processes the queue"""
        while not self.should_stop:
            try:
                # Get pending tasks
                pending_tasks = self.get_pending_tasks()
                
                if pending_tasks:
                    # Process the oldest task
                    task = pending_tasks[0]
                    print(f"Processing task {task['task_id']} for {task['organization_name']}")
                    
                    # Update status to processing
                    self.update_task_status(task['task_id'], TaskStatus.PROCESSING, 
                                          started_at=datetime.now())
                    
                    # Generate the plan
                    try:
                        from enhanced_emergency_plan_generator import EnhancedEmergencyPlanGenerator
                        generator = EnhancedEmergencyPlanGenerator()
                        
                        # Generate plan content
                        plan_content = generator.generate_plan(task['plan_inputs'])
                        
                        # Save plan and create PDF
                        filepath = generator.save_plan(plan_content, task['plan_inputs'])
                        
                        # Create password-protected PDF
                        from plan_generation_api import create_pdf_from_markdown
                        pdf_path = create_pdf_from_markdown(
                            plan_content, 
                            task['plan_inputs']['pdf_password'], 
                            task['plan_inputs']['organization_name']
                        )
                        
                        # Update task as completed
                        self.update_task_status(
                            task['task_id'], 
                            TaskStatus.COMPLETED,
                            completed_at=datetime.now(),
                            plan_content=plan_content,
                            pdf_path=pdf_path
                        )
                        
                        # Send email with the completed plan
                        email_sent = self.send_plan_email(task, pdf_path)
                        if email_sent:
                            print(f"Email sent successfully for task {task['task_id']}")
                        else:
                            print(f"Failed to send email for task {task['task_id']}")
                        
                        print(f"Task {task['task_id']} completed successfully")
                        
                    except Exception as e:
                        error_msg = str(e)
                        print(f"Task {task['task_id']} failed: {error_msg}")
                        self.update_task_status(
                            task['task_id'], 
                            TaskStatus.FAILED,
                            error_message=error_msg
                        )
                
                # Wait before checking for new tasks
                time.sleep(10)
                
            except Exception as e:
                print(f"Error in queue processing: {str(e)}")
                time.sleep(30)  # Wait longer on error

# Global queue instance
plan_queue = PlanQueueSystem()
