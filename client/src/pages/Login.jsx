import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getErrorMessage } from '../api/client.js';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(form.email, form.password);
      navigate(location.state?.from || (user.role === 'host' ? '/host' : '/'));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <form className="card form auth" onSubmit={submit}>
      <h1>Welcome back</h1>
      <input type="email" required placeholder="Email" value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input type="password" required placeholder="Password" value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })} />
      {error && <p className="error">{error}</p>}
      <button className="btn full">Login</button>
      <p className="muted">New to StayNest? <Link to="/register">Sign up</Link></p>
    </form>
  );
}
