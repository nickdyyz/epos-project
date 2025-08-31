// Password Protection Configuration
// Change these values to customize the password protection

export const PASSWORD_CONFIG = {
  // The access password - CHANGE THIS TO YOUR DESIRED PASSWORD
  CORRECT_PASSWORD: 'EPOS2024!',
  
  // Maximum number of failed attempts before lockout
  MAX_ATTEMPTS: 5,
  
  // Lockout duration in milliseconds (15 minutes = 15 * 60 * 1000)
  LOCKOUT_DURATION: 15 * 60 * 1000,
  
  // Session storage key for authentication
  AUTH_KEY: 'epos_password_authenticated',
  
  // Local storage key for lockout
  LOCKOUT_KEY: 'epos_lockout_until',
};

// Instructions for changing the password:
// 1. Change the CORRECT_PASSWORD value above
// 2. Deploy the updated code
// 3. Share the new password with authorized users
// 4. Consider using environment variables for production

export default PASSWORD_CONFIG;
