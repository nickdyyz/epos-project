// Password Protection Configuration Template
// Copy this file to passwordConfig.js and set your actual password

export const PASSWORD_CONFIG = {
  // The access password - CHANGE THIS TO YOUR DESIRED PASSWORD
  CORRECT_PASSWORD: 'YOUR_PASSWORD_HERE',
  
  // Maximum number of failed attempts before lockout
  MAX_ATTEMPTS: 5,
  
  // Lockout duration in milliseconds (15 minutes = 15 * 60 * 1000)
  LOCKOUT_DURATION: 15 * 60 * 1000,
  
  // Session storage key for authentication
  AUTH_KEY: 'epos_password_authenticated',
  
  // Local storage key for lockout
  LOCKOUT_KEY: 'epos_lockout_until',
};

// Instructions for setting up password protection:
// 1. Copy this file to passwordConfig.js
// 2. Replace 'YOUR_PASSWORD_HERE' with your actual password
// 3. The file will be automatically encrypted by git-secret
// 4. Only users with the correct GPG key can decrypt the file

export default PASSWORD_CONFIG;
