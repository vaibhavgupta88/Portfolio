import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import L from 'leaflet';

export const MapCard: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Initialize Real Leaflet Map with clean monochrome CartoDB Positron tiles
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const noidaCoords: L.LatLngExpression = [28.5355, 77.3910];

    const map = L.map(mapContainerRef.current, {
      center: noidaCoords,
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
      dragging: true,
      doubleClickZoom: false,
    });

    const cartoKey = (import.meta.env.VITE_CARTO_API_KEY as string | undefined)?.trim() || 'cb1_2x57_1_9c721959e1e41b2906c2e937';
    const tileUrl = `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png?key=${cartoKey}`;

    L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // Custom Minimal Pulse Marker at Noida Coordinates
    const customIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div class="relative flex items-center justify-center w-6 h-6 -ml-3 -mt-3">
          <div class="absolute w-6 h-6 rounded-full bg-[#FF5A1F]/30 animate-ping"></div>
          <div class="relative w-2.5 h-2.5 rounded-full bg-[#FF5A1F] border-2 border-white shadow-sm"></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    L.marker(noidaCoords, { icon: customIcon }).addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  return (
    <motion.div 
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="bg-white/80 hover:bg-white/90 dark:bg-[#181816]/85 dark:hover:bg-[#20201D]/95 backdrop-blur-2xl rounded-[28px] border border-white/70 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)] hover:shadow-[0_14px_40px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,1)] dark:hover:shadow-[0_14px_40px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.12)] flex flex-col justify-between h-full min-h-[340px] relative overflow-hidden group transition-all duration-300 select-none cursor-default"
    >
      {/* Top Left Clean Unboxed "Map" Heading */}
      <div className="absolute top-6 left-6 z-20">
        <h3 className="text-xs font-bold text-[#8A8A85] dark:text-[#787872] uppercase tracking-wider">
          Map
        </h3>
      </div>

      {/* Top Map Section (Real Draggable Leaflet Map) */}
      <div className="relative w-full h-[62%] overflow-hidden">
        <div ref={mapContainerRef} className="w-full h-full grayscale contrast-[1.05] brightness-95 dark:invert dark:hue-rotate-180 dark:brightness-85 dark:contrast-115" />

        {/* Bottom Fade Mask into Pure White / Dark Container */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white via-white/85 to-transparent dark:from-[#181816] dark:via-[#181816]/85 z-10 pointer-events-none" />
      </div>

      {/* Bottom Architectural Typography matching reference image */}
      <div className="relative z-20 flex flex-col items-center justify-center pb-6 pt-1 text-center bg-white/90 dark:bg-[#181816]/95 backdrop-blur-md">
        <h3 className="text-xl sm:text-[22px] font-bold text-[#111111] dark:text-[#F4F4F2] tracking-[0.35em] uppercase pl-[0.35em] leading-tight">
          NOIDA
        </h3>
        
        <p className="text-[10px] sm:text-[11px] font-medium text-[#787873] dark:text-[#8A8A85] tracking-[0.38em] uppercase pl-[0.38em] mt-1">
          INDIA
        </p>
        
        <p className="text-[9px] font-mono text-[#A8A8A2] dark:text-[#666660] tracking-[0.18em] uppercase pl-[0.18em] mt-1.5">
          28.5355° N, 77.3910° E
        </p>
      </div>
    </motion.div>
  );
};
