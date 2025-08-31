# EPOS Password Protection System

## 🔒 **Overview**

The EPOS application now includes a password protection layer that adds an additional security barrier before users can access the main application. This provides an extra layer of security for early access users.

## 🛡️ **Security Features**

### **Multi-Layer Protection**
1. **Password Protection**: Initial access password required
2. **AWS Cognito**: User authentication and management
3. **Session Management**: Secure session handling

### **Security Measures**
- **Rate Limiting**: Maximum 5 failed attempts
- **Account Lockout**: 15-minute lockout after max attempts
- **Session Persistence**: Remembers authentication during browser session
- **Secure Storage**: Uses browser storage for session management

## 🔧 **Configuration**

### **Current Settings**
- **Access Password**: `EPOS2024!`
- **Max Attempts**: 5
- **Lockout Duration**: 15 minutes
- **Session Duration**: Browser session (until tab/window closed)

### **How to Change the Password**

1. **Edit Configuration File**:
   ```bash
   # Open the configuration file
   emplan-web-vite/src/config/passwordConfig.js
   ```

2. **Change the Password**:
   ```javascript
   export const PASSWORD_CONFIG = {
     // Change this line to your desired password
     CORRECT_PASSWORD: 'YOUR_NEW_PASSWORD_HERE',
     // ... other settings
   };
   ```

3. **Deploy Changes**:
   - Commit and push to GitHub
   - Vercel will automatically redeploy

### **Customization Options**

You can also customize other settings:

```javascript
export const PASSWORD_CONFIG = {
  CORRECT_PASSWORD: 'YOUR_PASSWORD',
  MAX_ATTEMPTS: 3,           // Change max attempts
  LOCKOUT_DURATION: 30 * 60 * 1000,  // Change to 30 minutes
  // ... other settings
};
```

## 👥 **User Management**

### **Sharing Access**
1. **Share Password**: Provide the access password to authorized users
2. **Instructions**: Give users the Vercel URL and password
3. **Security**: Remind users to keep the password confidential

### **Password Distribution**
- **Email**: Send password via secure email
- **Slack/Teams**: Share in private channels
- **Password Managers**: Add to team password manager
- **In-Person**: Share verbally during meetings

## 🔄 **User Experience Flow**

### **First-Time Access**
1. User visits EPOS URL
2. **Password Protection Screen** appears
3. User enters access password (`EPOS2024!`)
4. If correct → proceeds to **AWS Cognito Login**
5. User creates account or signs in
6. User completes onboarding
7. User accesses EPOS dashboard

### **Returning Users**
1. User visits EPOS URL
2. If session is valid → goes directly to **AWS Cognito Login**
3. User signs in with their account
4. User accesses EPOS dashboard

### **Failed Access Attempts**
1. User enters incorrect password
2. Error message shows remaining attempts
3. After 5 failed attempts → 15-minute lockout
4. Countdown timer shows remaining lockout time
5. After lockout expires → user can try again

## 🚨 **Security Considerations**

### **Password Strength**
- Use a strong password (12+ characters)
- Include uppercase, lowercase, numbers, symbols
- Avoid common words or patterns
- Change password regularly

### **Access Control**
- Limit password sharing to authorized users only
- Monitor access patterns
- Consider IP restrictions for production
- Implement audit logging

### **Session Security**
- Sessions expire when browser tab/window closes
- No persistent login across browser sessions
- Lockout prevents brute force attacks

## 📋 **Administration Tasks**

### **Regular Maintenance**
- [ ] Change password monthly
- [ ] Review authorized users
- [ ] Monitor failed access attempts
- [ ] Update security settings as needed

### **Emergency Procedures**
- **Password Compromise**: Change password immediately
- **Unauthorized Access**: Review access logs
- **System Issues**: Check Vercel deployment status

## 🔧 **Technical Implementation**

### **Files Modified**
- `src/PasswordProtection.jsx` - Main protection component
- `src/config/passwordConfig.js` - Configuration file
- `src/App.jsx` - Wrapped with password protection

### **Storage Used**
- **SessionStorage**: `epos_password_authenticated` - Session persistence
- **LocalStorage**: `epos_lockout_until` - Lockout management

### **Security Features**
- Client-side password validation
- Rate limiting with lockout
- Session management
- Secure storage handling

## 📞 **Support**

### **Common Issues**
- **Forgot Password**: Check configuration file
- **Locked Out**: Wait for lockout to expire
- **Session Issues**: Clear browser storage
- **Deployment Issues**: Check Vercel logs

### **Getting Help**
- Check Vercel deployment logs
- Review browser console for errors
- Contact development team
- Check GitHub issues

## 🎯 **Best Practices**

### **For Administrators**
- Use strong, unique passwords
- Change password regularly
- Monitor access patterns
- Keep password distribution secure

### **For Users**
- Keep password confidential
- Don't share access with unauthorized users
- Report suspicious activity
- Use secure networks when accessing

---

**The password protection system provides an additional security layer for EPOS early access while maintaining a smooth user experience.**
