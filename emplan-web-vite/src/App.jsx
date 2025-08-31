import React from 'react';
import CustomAuth from './CustomAuth';
import PasswordProtection from './PasswordProtection';

function App() {
  console.log('App: Component rendering...');
  return (
    <PasswordProtection>
      <CustomAuth />
    </PasswordProtection>
  );
}

export default App;
