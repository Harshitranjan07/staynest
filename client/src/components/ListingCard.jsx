import { Link } from 'react-router-dom';
import { formatINR } from '../utils/format.js';

export default function ListingCard({ listing }) {
  return (
    <Link to={`/stays/${listing._id}`} className="card listing-card">
      <img src={listing.images[0]} alt={listing.title} />
      <div className="card-body">
        <div className="row-between">
          <span className="tag">{listing.type}</span>
          <span className="muted">
            {listing.reviewCount > 0 ? `★ ${listing.avgRating} (${listing.reviewCount})` : 'New'}
          </span>
        </div>
        <strong className="listing-title">{listing.title}</strong>
        <span className="muted">{listing.city}, {listing.state}</span>
        <span>
          <strong>{formatINR(listing.pricePerNight)}</strong> <span className="muted">/ night</span>
        </span>
      </div>
    </Link>
  );
}
