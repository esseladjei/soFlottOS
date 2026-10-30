"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";
import type { RouteEndpoint, RoutePoint } from "@/types/api";

interface RouteMapProps {
  pickup: RouteEndpoint;
  dropoff: RouteEndpoint;
  geometry: RoutePoint[];
  pickupLabel: string;
  dropoffLabel: string;
}

/**
 * Draws the driving path on free OpenStreetMap tiles. Leaflet touches `window` as soon as it
 * is imported, so the module is pulled in lazily inside the effect and this component is only
 * ever rendered through a `ssr: false` dynamic import.
 */
export default function RouteMap({ pickup, dropoff, geometry, pickupLabel, dropoffLabel }: RouteMapProps) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    let cancelled = false;

    void (async () => {
      const L = await import("leaflet");
      if (cancelled || !container.current) return;

      map.current?.remove();
      const instance = L.map(element, { scrollWheelZoom: false, attributionControl: true });
      map.current = instance;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(instance);

      const marker = (color: string, letter: string) =>
        L.divIcon({
          className: "",
          html: `<span style="display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:9999px;background:${color};color:#fff;font-weight:700;font-size:13px;box-shadow:0 1px 4px rgba(0,0,0,.4)">${letter}</span>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

      L.marker([Number(pickup.lat), Number(pickup.lng)], { icon: marker("#ea580c", "A") })
        .addTo(instance)
        .bindPopup(`<strong>${pickupLabel}</strong><br/>${pickup.label}`);
      L.marker([Number(dropoff.lat), Number(dropoff.lng)], { icon: marker("#0284c7", "B") })
        .addTo(instance)
        .bindPopup(`<strong>${dropoffLabel}</strong><br/>${dropoff.label}`);

      const path: [number, number][] = (geometry.length > 1
        ? geometry
        : [pickup, dropoff]
      ).map((point) => [Number(point.lat), Number(point.lng)]);
      const line = L.polyline(path, { color: "#1d4ed8", weight: 5, opacity: 0.85 }).addTo(instance);
      instance.fitBounds(line.getBounds(), { padding: [32, 32] });
      instance.invalidateSize();
    })();

    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
    };
  }, [pickup, dropoff, geometry, pickupLabel, dropoffLabel]);

  return <div ref={container} className="h-72 w-full rounded-2xl border border-stone-200 sm:h-96" role="img" aria-label={`${pickupLabel} \u2192 ${dropoffLabel}`} />;
}
