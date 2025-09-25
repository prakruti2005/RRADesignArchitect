import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { isEmail, hasMinLen } from '../utils/validation';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!isEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!hasMinLen(password, 6)) {
      setError('Password must be at least 6 characters.');
      return;
    }
    try {
  await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      setError('Login failed. ' + (err?.message || ''));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form onSubmit={handleLogin} className="card-minimal p-8 rounded-none space-y-4 w-full max-w-md">
        <h2 className="section-title text-center mb-2">Admin Login</h2>
        <input
          type="email"
          placeholder="Admin email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full bg-black/20 border border-white/15 rounded-lg px-4 py-3 text-white focus:outline-none"
          required
          aria-invalid={!!error && !email}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full bg-black/20 border border-white/15 rounded-lg px-4 py-3 text-white focus:outline-none"
          required
          aria-invalid={!!error && !password}
        />
        <button type="submit" className="btn-primary btn-compact w-full mt-2">Login</button>
        {error && <div className="text-red-300 text-xs text-center">{error}</div>}
      </form>
    </div>
  );
};

export default Admin;
