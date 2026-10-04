import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

function LocationPicker({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      if (onLocationSelect) {
        onLocationSelect({
          lat: Number(e.latlng.lat.toFixed(6)),
          lng: Number(e.latlng.lng.toFixed(6)),
        });
      }
    },
  });
  return null;
}

export default function ListingMap({
  location,
  title,
  interactive = false,
  onLocationSelect = null,
  height = '320px',
  zoom = 13,
}) {
  const hasValidLocation =
    location &&
    typeof location.lat === 'number' &&
    typeof location.lng === 'number' &&
    !isNaN(location.lat) &&
    !isNaN(location.lng);

  if (!hasValidLocation && !interactive) {
    return null;
  }

  // Default fallback center to Central India (e.g. Nagpur / India center) if picking from scratch
  const center = hasValidLocation
    ? [location.lat, location.lng]
    : [20.5937, 78.9629];
  const activeZoom = hasValidLocation ? zoom : 5;

  return (
    <div className="map-container" style={{ width: '100%', height, borderRadius: 'var(--radius)', overflow: 'hidden', margin: '14px 0 24px' }}>
      <MapContainer
        center={center}
        zoom={activeZoom}
        scrollWheelZoom={false}
        style={{ width: '100%', height: '100%' }}
      >
        <ChangeView center={center} zoom={activeZoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {hasValidLocation && (
          <Marker position={[location.lat, location.lng]}>
            {title && <Popup>{title}</Popup>}
          </Marker>
        )}
        {interactive && <LocationPicker onLocationSelect={onLocationSelect} />}
      </MapContainer>
    </div>
  );
}
