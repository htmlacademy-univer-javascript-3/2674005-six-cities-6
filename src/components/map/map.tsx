import React, { useEffect, useRef, memo } from 'react';
import L, { Map as LeafletMap, Marker } from 'leaflet';
import type { Offer } from '../../types/offer';

type MapProps = {
  offers: Offer[];
  activeOfferId?: string | null;
};

const defaultIcon = L.icon({
  iconUrl: '/img/pin.svg',
  iconSize: [27, 39],
  iconAnchor: [13.5, 39]
});

const activeIcon = L.icon({
  iconUrl: '/img/pin-active.svg',
  iconSize: [27, 39],
  iconAnchor: [13.5, 39]
});

function MapComponent({ offers, activeOfferId }: MapProps): JSX.Element {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Record<string, Marker>>({});
  const prevCityRef = useRef<string | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || offers.length === 0) {
      return;
    }

    const currentCity = offers[0].city.name;
    const center = offers[0].location;

    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView(
        [center.latitude, center.longitude],
        center.zoom
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapRef.current);
      
      prevCityRef.current = currentCity;
    } else if (prevCityRef.current !== currentCity) {
      mapRef.current.flyTo(
        [center.latitude, center.longitude],
        center.zoom,
        {
          duration: 1.5,
          easeLinearity: 0.25
        }
      );
      prevCityRef.current = currentCity;
    }

    const currentOfferIds = new Set(offers.map((offer) => offer.id));
    Object.keys(markersRef.current).forEach((id) => {
      if (!currentOfferIds.has(id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });

    offers.forEach((offer) => {
      if (!offer.location) {
        return;
      }

      if (!markersRef.current[offer.id]) {
        const marker = L.marker(
          [offer.location.latitude, offer.location.longitude],
          { icon: defaultIcon }
        ).addTo(mapRef.current as LeafletMap);
        
        markersRef.current[offer.id] = marker;
      }
    });
  }, [offers]);

  useEffect(() => {
    Object.keys(markersRef.current).forEach((id) => {
      const isActive = id === activeOfferId;
      markersRef.current[id].setIcon(isActive ? activeIcon : defaultIcon);
    });
  }, [activeOfferId]);

  return (
    <div
      className="cities__map map"
      ref={mapContainerRef}
      style={{ height: '100%', width: '100%' }}
    />
  );
}

const Map = memo(MapComponent);
export default Map;
