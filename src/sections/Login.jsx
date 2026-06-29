import React from 'react';
import AuthCard from '../components/AuthCard';

function Login() {
  return (
    <section className="rs-auth-section">
      <AuthCard initialTab="login" />
    </section>
  );
}

export default Login;
