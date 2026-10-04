import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client.js';
import Loader from '../components/Loader.jsx';
import { formatDate, formatINR } from '../utils/format.js';

export default function Trips() {
  const location = useLocation();
  const [bookings, setBookings] = useState(null);
  const [error, setError] = useState('');
  const [cancellingBooking, setCancellingBooking] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = () =>
    api
      .get('/bookings/mine')
      .then(({ data }) => setBookings(data))
      .catch((err) => setError(getErrorMessage(err)));

  useEffect(() => {
    load();
  }, []);

  const handleConfirmCancel = async () => {
    if (!cancellingBooking || isSubmitting) return;
    try {
      setIsSubmitting(true);
      await api.patch(`/bookings/${cancellingBooking._id}/cancel`);
      setCancellingBooking(null);
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!bookings && !error) return <Loader />;

  return (
    <section>
      <h1>My Trips</h1>
      {location.state?.booked && <p className="success">Booking request sent to the host!</p>}
      {error && <p className="error">{error}</p>}
      {bookings?.length === 0 && (
        <p className="muted">No trips yet. <Link to="/">Find a stay</Link></p>
      )}
      <div className="trip-list">
        {bookings?.map((b) => (
          <div key={b._id} className="card trip">
            <img src={b.listing?.images?.[0]} alt={b.listing?.title} />
            <div className="grow">
              <Link to={`/stays/${b.listing?._id}`}><strong>{b.listing?.title}</strong></Link>
              <p className="muted">{b.listing?.city}</p>
              <p>
                {formatDate(b.checkIn)} → {formatDate(b.checkOut)} · {b.nights} night{b.nights > 1 ? 's' : ''} · {b.guests} guest{b.guests > 1 ? 's' : ''}
              </p>
            </div>
            <div className="trip-side">
              <span className={`status status-${b.status}`}>{b.status}</span>
              <strong>{formatINR(b.totalPrice)}</strong>
              {['pending', 'confirmed'].includes(b.status) && (
                <button className="btn btn-danger" onClick={() => setCancellingBooking(b)}>Cancel</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {cancellingBooking && (
        <div
          className="modal-backdrop"
          onClick={() => !isSubmitting && setCancellingBooking(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-dialog-title"
        >
          <div className="card modal-card" onClick={(e) => e.stopPropagation()}>
            <h2 id="cancel-dialog-title" style={{ margin: 0 }}>Cancel booking</h2>
            <p style={{ margin: 0 }}>
              Are you sure you want to cancel your stay at <strong>{cancellingBooking.listing?.title}</strong>?
            </p>
            <p className="muted" style={{ margin: 0 }}>
              <strong>Dates:</strong> {formatDate(cancellingBooking.checkIn)} – {formatDate(cancellingBooking.checkOut)}
            </p>
            <div className="row" style={{ justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setCancellingBooking(null)}
                disabled={isSubmitting}
              >
                Keep Booking
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleConfirmCancel}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
