import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

function LocationMarker({ coords, onPick, picking }) {
  useMapEvents({
    click(e) {
      if (picking) {
        const { lat, lng } = e.latlng;
        onPick({ latitude: lat, longitude: lng });
      }
    },
  });

  return coords ? (
    <Marker position={[coords.latitude, coords.longitude]} icon={customIcon} />
  ) : null;
}

export default function MapPicker({ coords, onPick, picking }) {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer
        center={
          coords ? [coords.latitude, coords.longitude] : [21.006728, 105.845035]
        }
        zoom={18}
        scrollWheelZoom={true}
        style={{
          height: "350px",
          width: "100%",
          borderRadius: "12px",
          border: "1px solid #ccc",
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker coords={coords} onPick={onPick} picking={picking} />
      </MapContainer>
    </div>
  );
}
