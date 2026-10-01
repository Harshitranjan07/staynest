import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import StarRating from './StarRating.jsx';
import { formatDate } from '../utils/format.js';

export default function Reviews({ listingId, onReviewAdded }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ rating: 5, comment: '' });
  const [error, setError] = useState('');

  const load = () => api.get(`/listings/${listingId}/reviews`).then(({ data }) => setReviews(data));
  useEffect(() => {
    load();
  }, [listingId]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post(`/listings/${listingId}/reviews`, form);
      setForm({ rating: 5, comment: '' });
      load();
      onReviewAdded?.();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <section className="reviews">
      <h2>Reviews ({reviews.length})</h2>
      {reviews.length === 0 && <p className="muted">No reviews yet.</p>}
      {reviews.map((r) => (
        <div key={r._id} className="review">
          <div className="row-between">
            <strong>{r.user?.name}</strong>
            <span className="muted small">{formatDate(r.createdAt)}</span>
          </div>
          <div className="stars-static">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
          <p>{r.comment}</p>
        </div>
      ))}

      {user && (
        <form className="card form" onSubmit={submit}>
          <h3>Write a review</h3>
          <StarRating value={form.rating} onChange={(rating) => setForm({ ...form, rating })} />
          <textarea
            required
            placeholder="How was your stay?"
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
          />
          {error && <p className="error">{error}</p>}
          <button className="btn">Submit review</button>
        </form>
      )}
    </section>
  );
}
