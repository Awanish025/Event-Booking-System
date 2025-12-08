import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const MapComponent = ({ className = "w-full h-72", lat, lng }) => {
    // Default to Lucknow if coordinates are not provided
    const hasCoordinates = lat && lng;
    const position = hasCoordinates ? [lat, lng] : [26.8467, 80.9462];

    return (
        <div className={`rounded-xl overflow-hidden relative z-0 ${className}`}>
            <MapContainer
                center={position}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                key={`${position[0]}-${position[1]}`} // Re-render map when position changes
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={position}>
                    <Popup>Event Location 📍</Popup>
                </Marker>
            </MapContainer>
        </div >
    );
};

export default MapComponent;
