import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client.js';
import Loader from '../components/Loader.jsx';
import BookingBox from '../components/BookingBox.jsx';
import Reviews from '../components/Reviews.jsx';

export default function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [error, setError] = useState('');

  const load = () =>
    api
      .get(`/listings/${id}`)
      .then(({ data }) => {
        setListing(data);
        setActiveImageIndex(0);
      })
      .catch((err) => setError(getErrorMessage(err)));

  useEffect(() => {
    load();
  }, [id]);

  if (error) return <p className="error">{error}</p>;
  if (!listing) return <Loader />;

  const validImages = Array.isArray(listing.images) && listing.images.length > 0
    ? listing.images.filter(Boolean)
    : ['https://placehold.co/800x500?text=StayNest'];

  const currentImage = validImages[activeImageIndex] || validImages[0];

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveImageIndex(index);
    }
  };

  return (
    <section>
      <h1>{listing.title}</h1>
      <p className="muted">
        {listing.reviewCount > 0 ? `★ ${listing.avgRating} · ${listing.reviewCount} reviews · ` : ''}
        {listing.city}, {listing.state}
      </p>

      <div className="gallery">
        <img className="hero-img gallery-main-img" src={currentImage} alt={`${listing.title} - photo ${activeImageIndex + 1}`} />
        {validImages.length > 1 && (
          <div className="gallery-thumbnails" role="tablist" aria-label="Listing photo gallery">
            {validImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                className={`gallery-thumb-btn ${idx === activeImageIndex ? 'active' : ''}`}
                onClick={() => setActiveImageIndex(idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                aria-label={`View photo ${idx + 1}`}
                aria-selected={idx === activeImageIndex}
                role="tab"
              >
                <img src={img} alt={`${listing.title} thumbnail ${idx + 1}`} className="gallery-thumb-img" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="detail-layout">
        <div>
          <h2>
            {listing.type} hosted by {listing.host?.name}
          </h2>
          <p className="muted">
            Up to {listing.maxGuests} guests · {listing.bedrooms} bedroom{listing.bedrooms !== 1 ? 's' : ''}
          </p>
          <p>{listing.description}</p>

          <h3>Amenities</h3>
          <ul className="amenities">
            {listing.amenities.map((a) => <li key={a}>✓ {a}</li>)}
          </ul>

          <h3>Location</h3>
          <p className="muted">{listing.address}, {listing.city}</p>
          {/* TODO: show a map (Leaflet + OpenStreetMap) - see issue tracker */}

          <Reviews listingId={listing._id} onReviewAdded={load} />
        </div>
        <BookingBox listing={listing} />
      </div>
    </section>
  );
}
