"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";

// Fix Leaflet marker icons which are often broken by build systems
const fixLeafletIcons = () => {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
};

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false },
);
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), {
  ssr: false,
});
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), {
  ssr: false,
});

interface MapPreviewProps {
  customerLoc?: { lat: number; lng: number };
  helperLoc?: { lat: number; lng: number };
  zoom?: number;
}

export function MapPreview({
  customerLoc,
  helperLoc,
  zoom = 13,
}: MapPreviewProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fixLeafletIcons();
  }, []);

  if (!isClient)
    return (
      <div className="w-full h-full bg-dark-surface animate-pulse rounded-2xl" />
    );

  const center: [number, number] = customerLoc
    ? [customerLoc.lat, customerLoc.lng]
    : [33.6844, 73.0479]; // Default Islamabad

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-dark-border shadow-2xl relative z-0">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />
        {customerLoc && (
          <Marker position={[customerLoc.lat, customerLoc.lng]}>
            <Popup>📍 Customer Location</Popup>
          </Marker>
        )}
        {helperLoc && (
          <Marker position={[helperLoc.lat, helperLoc.lng]}>
            <Popup>🚗 Helper Location</Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Dark overlay for map to match theme */}
      <style jsx global>{`
        .leaflet-container {
          background: #0f172a !important;
        }
        .map-tiles {
          filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
        }
      `}</style>
    </div>
  );
}
