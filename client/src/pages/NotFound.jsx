import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="empty">
      <h1>404</h1>
      <p className="muted">Looks like this nest is empty.</p>
      <Link to="/" className="btn">Back to Explore</Link>
    </section>
  );
}
