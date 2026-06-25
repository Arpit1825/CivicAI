import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';

export default function InteractiveMap({ 
  issues = [], 
  center = [40.730610, -73.935242], // New York center
  zoom = 12, 
  onMapClick = null, 
  selectedPosition = null,
  readOnly = false 
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerGroupRef = useRef(null);
  const selectorMarkerRef = useRef(null);
  const navigate = useNavigate();

  // Create custom marker icon based on status
  const createCustomIcon = (status) => {
    const colors = {
      Reported: '#64748b', // Slate
      Verified: '#6366f1', // Indigo
      'In Progress': '#3b82f6', // Blue
      Resolved: '#10b981', // Emerald
    };
    const color = colors[status] || '#3b82f6';
    
    return L.divIcon({
      html: `
        <div className="relative flex items-center justify-center w-8 h-8">
          <div className="absolute w-8 h-8 rounded-full opacity-30 animate-pulse" style="background-color: ${color}"></div>
          <div className="absolute w-5 h-5 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white" style="background-color: ${color}">
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
          </div>
        </div>
      `,
      className: 'custom-leaflet-icon',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
    });
  };

  // Create marker icon for location picking
  const createSelectorIcon = () => {
    return L.divIcon({
      html: `
        <div className="relative flex items-center justify-center w-10 h-10">
          <div className="absolute w-10 h-10 rounded-full bg-blue-500/30 animate-ping" style="animation-duration: 3s"></div>
          <div className="w-7 h-7 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
          </div>
        </div>
      `,
      className: 'custom-selector-icon',
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });
  };

  
  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Safeguard to prevent duplicate initialization on hot-reload/double mounts
    if (mapContainerRef.current._leaflet_id) return;

    // Create Leaflet map instance
    const map = L.map(mapContainerRef.current, {
      center: center,
      zoom: zoom,
      zoomControl: true
    });

    mapInstanceRef.current = map;

    // Add Tile Layer (OpenStreetMap vector styling placeholder)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // Create marker group layer
    const markerGroup = L.layerGroup().addTo(map);
    markerGroupRef.current = markerGroup;

    // Listen to Map click for picker
    if (onMapClick) {
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        onMapClick(lat, lng);
      });
    }

    // Fix map display glitches on size resize
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    // Clean up
    return () => {
      map.remove();
    };
  }, []); // Run only once on mount

  // Sync markers when issues list changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markerGroup = markerGroupRef.current;
    if (!map || !markerGroup || readOnly) return;

    // Clear previous markers
    markerGroup.clearLayers();

    // Add pins for all issues
    issues.forEach(issue => {
      if (!issue.lat || !issue.lng) return;

      const marker = L.marker([issue.lat, issue.lng], {
        icon: createCustomIcon(issue.status)
      });

      // Custom popups that look like modern cards
      const popupContent = document.createElement('div');
      popupContent.className = 'p-2 w-48 font-sans';
      popupContent.innerHTML = `
        <h4 className="font-bold text-slate-800 text-sm mb-1">${issue.title}</h4>
        <div className="flex justify-between items-center text-xs text-slate-500 mb-2 capitalize">
          <span>${issue.category.replace('-', ' ')}</span>
          <span className="font-semibold text-slate-700">${issue.status}</span>
        </div>
        <button id="btn-${issue.id}" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1.5 px-3 rounded-md transition-colors text-center block">
          View Details
        </button>
      `;

      // Set popup
      marker.bindPopup(popupContent);

      // Programmatically listen to button click inside leaflet popup
      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-${issue.id}`);
        if (btn) {
          btn.onclick = () => {
            navigate(`/issue/${issue.id}`);
          };
        }
      });

      marker.addTo(markerGroup);
    });

  }, [issues, readOnly]);

  // Sync picker position
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (selectedPosition && selectedPosition.lat && selectedPosition.lng) {
      const pos = [selectedPosition.lat, selectedPosition.lng];
      
      if (selectorMarkerRef.current) {
        selectorMarkerRef.current.setLatLng(pos);
      } else {
        const marker = L.marker(pos, {
          icon: createSelectorIcon()
        }).addTo(map);
        selectorMarkerRef.current = marker;
      }
      
      // Pan to new selector position
      map.panTo(pos);
    } else {
      if (selectorMarkerRef.current) {
        selectorMarkerRef.current.remove();
        selectorMarkerRef.current = null;
      }
    }
  }, [selectedPosition]);

  return (
    <div className="relative w-full h-full border border-slate-200 shadow-inner rounded-xl overflow-hidden bg-slate-100">
      <div ref={mapContainerRef} className="w-full h-full min-h-[300px]"></div>
      
      {onMapClick && !selectedPosition && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-slate-900/90 text-white text-xs py-2 px-4 rounded-full font-medium shadow-md pointer-events-none z-45 text-center whitespace-nowrap">
          📍 Click anywhere on the map to set the issue location
        </div>
      )}
    </div>
  );
}
