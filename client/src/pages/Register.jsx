import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getErrorMessage } from '../api/client.js';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'guest' });
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      const user = await register(form.name, form.email, form.password, form.role);
      navigate(user.role === 'host' ? '/host' : '/');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <form className="card form auth" onSubmit={submit}>
      <h1>Create account</h1>
      <input required placeholder="Full name" value={form.name} onChange={set('name')} />
      <input type="email" required placeholder="Email" value={form.email} onChange={set('email')} />
      <input type="password" required minLength={6} placeholder="Password (min 6 chars)"
        value={form.password} onChange={set('password')} />
      <div className="role-toggle">
        <label>
          <input type="radio" name="role" value="guest" checked={form.role === 'guest'} onChange={set('role')} />
          I want to book stays
        </label>
        <label>
          <input type="radio" name="role" value="host" checked={form.role === 'host'} onChange={set('role')} />
          I want to host
        </label>
      </div>
      {error && <p className="error">{error}</p>}
      <button className="btn full">Sign up</button>
      <p className="muted">Already have an account? <Link to="/login">Login</Link></p>
    </form>
  );
}
