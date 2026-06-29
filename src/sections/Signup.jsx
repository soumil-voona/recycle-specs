import React from 'react';
import AuthCard from '../components/AuthCard';

function Signup() {
  return (
    <section className="rs-auth-section">
      <AuthCard initialTab="signup" />
    </section>
  );
}

export default Signup;
