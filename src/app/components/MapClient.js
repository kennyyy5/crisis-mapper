"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for missing marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function MapClient({ quakes }) {
  return (
    <>
     <h2 className="text-xl font-semibold mb-4">Recent Disasters</h2>
    <MapContainer
      center={[20, 0]}
      zoom={2}
      scrollWheelZoom={true}
      style={{ height: "80vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {quakes.map((quake) => (
        <Marker key={quake.id} position={[quake.lat, quake.lon]}>
          <Popup>
            <strong>{quake.title}</strong>
            <br />
            {quake.description}
            <br />
            <a href={quake.link} target="_blank" rel="noopener noreferrer">
              More info
            </a>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
    </>
  );
}
