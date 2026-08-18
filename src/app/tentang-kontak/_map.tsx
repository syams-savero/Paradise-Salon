"use client";

import { useEffect, useRef } from "react";
import type { Branch } from "@/data/content";

const LEAFLET_CSS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";

export function BranchMap({ branches }: { branches: Branch[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    let cancelled = false;

    (async () => {
      if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = LEAFLET_CSS;
        document.head.appendChild(link);
      }

      const L = (await import("leaflet")).default;

      if (cancelled || !mapRef.current) return;

      const center: [number, number] = [branches[0].lat, branches[0].lng];
      const map = L.map(mapRef.current, {
        center,
        zoom: 13,
        scrollWheelZoom: false,
        attributionControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      branches.forEach((b) => {
        const icon = L.divIcon({
          html: `<div style="background:#b76e79;color:#fff;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:13px;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3)">${b.name.split(" ").pop()?.[0] ?? "P"}</div>`,
          className: "",
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        L.marker([b.lat, b.lng], { icon })
          .addTo(map)
          .bindPopup(
            `<div style="font-family:system-ui;min-width:160px">
              <strong style="font-size:14px">${b.name}</strong><br/>
              <span style="font-size:12px;color:#666">${b.address}</span>
            </div>`
          );
      });

      if (branches.length > 1) {
        const bounds = L.latLngBounds(branches.map((b) => [b.lat, b.lng] as [number, number]));
        map.fitBounds(bounds, { padding: [40, 40] });
      }

      mapInstance.current = map;
    })();

    return () => {
      cancelled = true;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [branches]);

  return (
    <div
      ref={mapRef}
      className="h-[400px] w-full border border-line"
      style={{ zIndex: 0 }}
    />
  );
}
