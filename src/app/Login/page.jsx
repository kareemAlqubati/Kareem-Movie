'use client'; 
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig'; 
import { useRouter } from 'next/navigation'; 
import Link from 'next/link';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    console.log('Attempting to log in with:', { email, password });

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful'); 
      router.push('/'); 
    } catch (error) {
      console.error('Login failed:', error); 
      switch (error.code) {
        case 'auth/user-not-found':
          setError('No user found with this email.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.');
          break;
        case 'auth/invalid-email':
          setError('The email address is not valid.');
          break;
        default:
          setError(error.message);
          break;
      }
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-cover bg-center">
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200 rounded-full transform -translate-x-1/2 -translate-y-1/2 opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-200 rounded-full transform translate-x-1/2 translate-y-1/2 opacity-30"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-200 rounded-full transform translate-x-1/2 -translate-y-1/2 opacity-20"></div>

      <div className="w-full max-w-md p-8 space-y-8 rounded shadow">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          {error && <p className="text-red-500">{error}</p>}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center">Dont have an account{' '}
          <Link href="/Register" className="text-blue-500">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
