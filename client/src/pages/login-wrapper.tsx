import { useEffect } from 'react';
import { useLocation } from 'wouter';
import LoginPage from './login-page';

export default function LoginWrapper() {
  const [, setLocation] = useLocation();
  
  // Check if user is already logged in when component mounts
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          // User is logged in, redirect to dashboard
          setLocation('/');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };
    
    checkAuth();
  }, [setLocation]);
  
  // Return the login page
  return <LoginPage onLoginSuccess={() => setLocation('/')} />;
}