# Git-Secret Setup for EPOS Password Protection

## 🔐 **Overview**

The EPOS project now uses git-secret to encrypt sensitive configuration files, specifically the password configuration file. This ensures that sensitive data like access passwords are never stored in plain text in the Git repository.

## 🛡️ **Security Benefits**

- **Encrypted Storage**: Password configuration is encrypted in Git
- **GPG Protection**: Uses your GPG key for encryption/decryption
- **Access Control**: Only users with the correct GPG key can decrypt
- **Audit Trail**: All changes to encrypted files are tracked in Git

## 📁 **Files Protected**

- `emplan-web-vite/src/config/passwordConfig.js` - **ENCRYPTED** (contains actual password)
- `emplan-web-vite/src/config/passwordConfig.template.js` - **TEMPLATE** (safe to share)

## 🔧 **Current Setup**

### **GPG Key**
- **Name**: Nicholas Deshpande
- **Email**: nick.deshpande@gmail.com
- **Key ID**: D95497FDB02A592F259BF680AB14DB839C409C97
- **Type**: ed25519 (modern, secure)

### **Git-Secret Status**
- ✅ **Initialized**: `.gitsecret/` directory created
- ✅ **User Added**: Your GPG key is registered
- ✅ **File Encrypted**: `passwordConfig.js` is encrypted
- ✅ **Template Created**: Safe template file available

## 🚀 **Working with Encrypted Files**

### **For Development (You)**

#### **Decrypt Files**
```bash
# Decrypt all secret files
git secret reveal

# Decrypt specific file
git secret reveal emplan-web-vite/src/config/passwordConfig.js
```

#### **Edit Password Configuration**
```bash
# 1. Decrypt the file
git secret reveal

# 2. Edit the password
nano emplan-web-vite/src/config/passwordConfig.js

# 3. Re-encrypt the file
git secret hide

# 4. Commit changes
git add .
git commit -m "Update password configuration"
```

#### **Add New Secret Files**
```bash
# Add file to git-secret
git secret add path/to/secret/file

# Encrypt all secret files
git secret hide
```

### **For Other Developers**

#### **Initial Setup**
```bash
# 1. Clone the repository
git clone https://github.com/nickdyyz/epos-project.git
cd epos-project

# 2. Install git-secret
brew install git-secret  # macOS
# or
sudo apt-get install git-secret  # Ubuntu

# 3. Add your GPG key (if you have one)
git secret tell your-email@example.com

# 4. Decrypt files
git secret reveal
```

#### **Daily Workflow**
```bash
# Pull latest changes
git pull origin main

# Decrypt files (if needed)
git secret reveal

# Make changes...

# Re-encrypt before committing
git secret hide
git add .
git commit -m "Your changes"
```

## 🔑 **Password Management**

### **Current Password**
- **Access Password**: `EPOS2024!` (stored in encrypted file)
- **Location**: `emplan-web-vite/src/config/passwordConfig.js`

### **Changing the Password**

#### **Method 1: Using git-secret**
```bash
# 1. Decrypt the file
git secret reveal

# 2. Edit the password
nano emplan-web-vite/src/config/passwordConfig.js
# Change: CORRECT_PASSWORD: 'YOUR_NEW_PASSWORD'

# 3. Re-encrypt
git secret hide

# 4. Commit and push
git add .
git commit -m "Update access password"
git push origin main
```

#### **Method 2: Using Template**
```bash
# 1. Copy template
cp emplan-web-vite/src/config/passwordConfig.template.js emplan-web-vite/src/config/passwordConfig.js

# 2. Edit with your password
nano emplan-web-vite/src/config/passwordConfig.js

# 3. Add to git-secret
git secret add emplan-web-vite/src/config/passwordConfig.js

# 4. Encrypt
git secret hide

# 5. Commit
git add .
git commit -m "Add new password configuration"
```

## 👥 **Adding Team Members**

### **Add New GPG Key**
```bash
# 1. Get the new user's public GPG key
gpg --import new-user-public-key.asc

# 2. Add them to git-secret
git secret tell new-user@example.com

# 3. Re-encrypt files with new key
git secret hide

# 4. Commit changes
git add .
git commit -m "Add new team member to git-secret"
```

### **Remove User Access**
```bash
# Remove user from git-secret
git secret killperson user@example.com

# Re-encrypt files
git secret hide

# Commit changes
git add .
git commit -m "Remove user access from git-secret"
```

## 🚨 **Security Best Practices**

### **GPG Key Management**
- **Backup**: Export and backup your GPG private key
- **Passphrase**: Use a strong passphrase for your GPG key
- **Revocation**: Keep revocation certificates safe
- **Rotation**: Rotate keys periodically

### **File Management**
- **Never commit**: Unencrypted secret files
- **Always encrypt**: Before committing changes
- **Template files**: Use templates for documentation
- **Access control**: Limit who has GPG keys

### **Team Security**
- **Key verification**: Verify GPG keys before adding
- **Access review**: Regularly review who has access
- **Documentation**: Keep setup instructions updated
- **Training**: Ensure team knows how to use git-secret

## 🔍 **Troubleshooting**

### **Common Issues**

#### **"git-secret: abort: file tracked in git"**
```bash
# Remove from Git tracking
git rm --cached path/to/file

# Add to git-secret
git secret add path/to/file

# Encrypt
git secret hide
```

#### **"gpg: decryption failed"**
```bash
# Check if you have the correct GPG key
gpg --list-secret-keys

# Import missing key
gpg --import missing-key.asc

# Try decrypting again
git secret reveal
```

#### **"git-secret: abort: file not found"**
```bash
# Check if file exists
ls -la path/to/file

# Check git-secret status
git secret list

# Re-add if needed
git secret add path/to/file
```

### **Recovery Procedures**

#### **Lost GPG Key**
1. **Contact team**: Inform other team members
2. **Remove access**: `git secret killperson your-email@example.com`
3. **Re-encrypt**: `git secret hide`
4. **Create new key**: Generate new GPG key
5. **Add new key**: `git secret tell new-email@example.com`

#### **Corrupted Repository**
1. **Backup**: Save any unencrypted work
2. **Clean clone**: `git clone` fresh copy
3. **Decrypt**: `git secret reveal`
4. **Restore**: Copy back your work
5. **Re-encrypt**: `git secret hide`

## 📋 **Quick Reference**

### **Essential Commands**
```bash
# Decrypt all secrets
git secret reveal

# Encrypt all secrets
git secret hide

# Add new secret file
git secret add file.js

# Add new user
git secret tell user@example.com

# List secret files
git secret list

# Check status
git secret status
```

### **File Locations**
- **Encrypted**: `emplan-web-vite/src/config/passwordConfig.js.secret`
- **Template**: `emplan-web-vite/src/config/passwordConfig.template.js`
- **Git-secret config**: `.gitsecret/`

---

**Your password configuration is now securely encrypted and protected with GPG!**
