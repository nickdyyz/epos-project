# Vercel Environment Variables Setup

## 🔧 **Required Environment Variables**

To deploy EPOS with password protection, you need to set these environment variables in your Vercel project:

### **Password Protection Variables**

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `VITE_ACCESS_PASSWORD` | `EPOS2024!` | The access password for the application |
| `VITE_MAX_ATTEMPTS` | `5` | Maximum failed attempts before lockout |
| `VITE_LOCKOUT_DURATION` | `900000` | Lockout duration in milliseconds (15 minutes) |
| `VITE_AUTH_KEY` | `epos_password_authenticated` | Session storage key |
| `VITE_LOCKOUT_KEY` | `epos_lockout_until` | Local storage key for lockout |

## 🚀 **How to Set Environment Variables in Vercel**

### **Step 1: Go to Vercel Dashboard**
1. **Visit**: [vercel.com/dashboard](https://vercel.com/dashboard)
2. **Select**: Your EPOS project
3. **Click**: "Settings" tab

### **Step 2: Add Environment Variables**
1. **Click**: "Environment Variables" in the left sidebar
2. **Click**: "Add New" button
3. **Add each variable**:

```
Name: VITE_ACCESS_PASSWORD
Value: EPOS2024!
Environment: Production, Preview, Development

Name: VITE_MAX_ATTEMPTS
Value: 5
Environment: Production, Preview, Development

Name: VITE_LOCKOUT_DURATION
Value: 900000
Environment: Production, Preview, Development

Name: VITE_AUTH_KEY
Value: epos_password_authenticated
Environment: Production, Preview, Development

Name: VITE_LOCKOUT_KEY
Value: epos_lockout_until
Environment: Production, Preview, Development
```

### **Step 3: Redeploy**
1. **Click**: "Deployments" tab
2. **Click**: "Redeploy" on your latest deployment
3. **Wait**: For the build to complete

## 🔐 **Security Notes**

### **Password Management**
- **Current Password**: `EPOS2024!`
- **Change Password**: Update `VITE_ACCESS_PASSWORD` in Vercel
- **No Code Changes**: Password can be changed without redeploying code
- **Secure Storage**: Environment variables are encrypted in Vercel

### **Access Control**
- **Environment Variables**: Only visible to project owners
- **No Exposure**: Variables are not visible in client-side code
- **Audit Trail**: Vercel logs all environment variable changes

## 🎯 **Deployment Configuration**

### **Build Settings**
```
Framework Preset: Vite
Root Directory: emplan-web-vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### **Environment Variables**
All variables should be set for:
- ✅ **Production**
- ✅ **Preview** 
- ✅ **Development**

## 🚨 **Troubleshooting**

### **Build Still Fails**
1. **Check**: All environment variables are set
2. **Verify**: Variables are set for all environments
3. **Redeploy**: After adding variables

### **Password Not Working**
1. **Check**: `VITE_ACCESS_PASSWORD` is set correctly
2. **Verify**: No extra spaces in the value
3. **Test**: Try the exact password `EPOS2024!`

### **Environment Variables Not Loading**
1. **Check**: Variables start with `VITE_`
2. **Verify**: Variables are set for the correct environment
3. **Redeploy**: After making changes

## 📋 **Quick Setup Commands**

### **Using Vercel CLI (Alternative)**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Set environment variables
vercel env add VITE_ACCESS_PASSWORD
vercel env add VITE_MAX_ATTEMPTS
vercel env add VITE_LOCKOUT_DURATION
vercel env add VITE_AUTH_KEY
vercel env add VITE_LOCKOUT_KEY

# Deploy
vercel --prod
```

## 🎉 **Success Indicators**

After setting environment variables:
- ✅ **Build succeeds** without errors
- ✅ **Password protection** works correctly
- ✅ **Rate limiting** functions properly
- ✅ **Session management** works as expected
- ✅ **HTTPS** is active and secure

---

**Set these environment variables in Vercel and your EPOS application will deploy successfully with full password protection!**
