"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import React, { useEffect, useMemo } from "react";
import { MapContainer, Marker, TileLayer, Tooltip } from "react-leaflet";
import type { LatLngExpression } from "leaflet";

export type MapPoint = { lat: number; lng: number; label?: string };

// Fix default marker icons for bundlers (Next.js)
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function LiveMap(props: {
  customer?: MapPoint | null;
  helper?: MapPoint | null;
  className?: string;
}) {
  const center = useMemo(() => {
    if (props.helper) return [props.helper.lat, props.helper.lng] as const;
    if (props.customer)
      return [props.customer.lat, props.customer.lng] as const;
    return [24.8607, 67.0011] as const; // Karachi fallback
  }, [props.customer, props.helper]);

  // Avoid Leaflet icon issues on hot reloads
  useEffect(() => {
    L.Marker.prototype.options.icon = DefaultIcon;
  }, []);

  return (
    <div
      className={
        props.className ??
        "h-90 w-full rounded-2xl overflow-hidden border border-white/10"
      }
    >
      <MapContainer
        center={center as unknown as LatLngExpression}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {props.customer && (
          <Marker
            position={
              [
                props.customer.lat,
                props.customer.lng,
              ] as unknown as LatLngExpression
            }
          >
            <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent>
              {props.customer.label ?? "Customer"}
            </Tooltip>
          </Marker>
        )}

        {props.helper && (
          <Marker
            position={
              [
                props.helper.lat,
                props.helper.lng,
              ] as unknown as LatLngExpression
            }
          >
            <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent>
              {props.helper.label ?? "Helper"}
            </Tooltip>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
