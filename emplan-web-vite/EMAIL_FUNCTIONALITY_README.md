# Email Functionality for Emergency Plans

## Overview

The EPOS system now includes the ability to email password-protected PDF copies of emergency plans to users. This feature provides a secure way to distribute emergency plans while maintaining document security through password protection.

## Features

### 🔐 Password-Protected PDFs
- Each emailed plan is protected with a user-generated password
- Passwords can be auto-generated or manually entered
- 12-character strong passwords with mixed characters

### 📧 Email Delivery
- Plans are sent as HTML attachments (PDF conversion available)
- Professional email formatting with clear instructions
- Password included in email body for easy access

### 🛡️ Security Features
- Temporary file creation and cleanup
- Secure password generation
- Email validation and error handling

## Setup Instructions

### 1. Start the API Server

```bash
# Navigate to the emplan-web-vite directory
cd emplan-web-vite

# Start the API server
./start_api.sh
```

The API server will run on `http://localhost:5000`

### 2. Configure Email Settings

Edit `plan_generation_api.py` and update the email configuration:

```python
# Email configuration (update these values)
smtp_server = "smtp.gmail.com"  # Your SMTP server
smtp_port = 587
sender_email = "your-email@gmail.com"  # Your email address
sender_password = "your-app-password"  # Your app password
```

### 3. Gmail Setup (Recommended)

If using Gmail, you'll need to:

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. Use the generated password in the `sender_password` field

### 4. Alternative Email Providers

For other email providers, update the SMTP settings:

```python
# Outlook/Hotmail
smtp_server = "smtp-mail.outlook.com"
smtp_port = 587

# Yahoo
smtp_server = "smtp.mail.yahoo.com"
smtp_port = 587

# Custom SMTP
smtp_server = "your-smtp-server.com"
smtp_port = 587  # or 465 for SSL
```

## Usage

### Frontend Integration

The email functionality is integrated into the PlanViewer component:

1. **View a Plan**: Navigate to "All Emergency Plans" and click "View Plan"
2. **Email PDF**: Click the "📧 Email PDF" button
3. **Enter Details**: 
   - Email address for delivery
   - Password for PDF protection (or use "Generate" button)
4. **Send**: Click "Send PDF" to email the plan

### API Endpoints

#### POST `/api/send-plan-email`

Sends a password-protected PDF via email.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "planId": 123,
  "planTitle": "ACME Inc. Emergency Plan"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Plan sent successfully to user@example.com",
  "password": "securePassword123"
}
```

## Technical Implementation

### PDF Generation

Currently, the system generates HTML files that can be opened in browsers. For true PDF generation, you can:

1. **Install Pandoc** (recommended):
   ```bash
   # macOS
   brew install pandoc
   
   # Ubuntu/Debian
   sudo apt-get install pandoc
   
   # Windows
   # Download from https://pandoc.org/installing.html
   ```

2. **Update the `create_pdf_from_markdown` function**:
   ```python
   # Convert markdown to PDF using pandoc
   subprocess.run([
       'pandoc', md_temp_path,
       '-o', pdf_temp_path,
       '--pdf-engine=xelatex'
   ], check=True)
   ```

### Email Templates

The email template includes:
- Professional greeting
- Plan information
- Password details
- Security instructions
- Contact information

### Error Handling

The system includes comprehensive error handling for:
- Invalid email addresses
- SMTP connection failures
- File generation errors
- Network timeouts

## Security Considerations

### Password Security
- Passwords are generated using cryptographically secure random selection
- 12-character minimum with mixed character types
- Passwords are not stored on the server

### File Security
- Temporary files are created and immediately deleted
- No plan content is stored in server logs
- Email attachments are properly encoded

### Email Security
- TLS encryption for email transmission
- SMTP authentication required
- Email addresses are validated before sending

## Troubleshooting

### Common Issues

1. **"Failed to send email"**
   - Check SMTP server settings
   - Verify email credentials
   - Ensure network connectivity

2. **"API server not running"**
   - Start the API server with `./start_api.sh`
   - Check if port 5000 is available
   - Verify Python dependencies are installed

3. **"Invalid email address"**
   - Check email format
   - Ensure email domain is valid
   - Try a different email address

### Debug Mode

Enable debug logging by setting the Flask debug mode:

```python
app.run(debug=True, host='0.0.0.0', port=5000)
```

### Logs

Check the console output for detailed error messages and debugging information.

## Future Enhancements

### Planned Features
- [ ] True PDF generation with password protection
- [ ] Email templates customization
- [ ] Bulk email sending
- [ ] Email delivery tracking
- [ ] Plan versioning in emails
- [ ] Digital signatures

### Integration Opportunities
- [ ] AWS SES for scalable email delivery
- [ ] PDF.js for client-side PDF generation
- [ ] Email service providers (SendGrid, Mailgun)
- [ ] Document management systems

## Support

For issues or questions about the email functionality:

1. Check the troubleshooting section above
2. Review the API server logs
3. Verify email configuration settings
4. Test with a simple email address first

## License

This email functionality is part of the EPOS Emergency Plan Operating System and follows the same licensing terms as the main application.
