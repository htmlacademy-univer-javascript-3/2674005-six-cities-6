import React, { useEffect, useRef } from 'react';
import L, { Map as LeafletMap, LayerGroup } from 'leaflet';
import type { Offer } from '../../mocks/offers';

type MapProps = {
  offers: Offer[];
  activeOfferId?: number | null;
};

const defaultIcon = L.icon({
  iconUrl: 'img/pin.svg',
  iconSize: [27, 39],
  iconAnchor: [13.5, 39]
});

const activeIcon = L.icon({
  iconUrl: 'img/pin-active.svg',
  iconSize: [27, 39],
  iconAnchor: [13.5, 39]
});

function Map({ offers, activeOfferId }: MapProps): JSX.Element {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersLayerRef = useRef<LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || offers.length === 0) {
      return;
    }

    if (!mapRef.current) {
      const center = offers[0].location;

      mapRef.current = L.map(mapContainerRef.current).setView(
        [center.latitude, center.longitude],
        center.zoom
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapRef.current);

      markersLayerRef.current = L.layerGroup().addTo(mapRef.current);
    }
  }, [offers]);

  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) {
      return;
    }

    markersLayerRef.current.clearLayers();

    offers.forEach((offer) => {
      if (!offer.location) {
        return;
      }

      const isActive = offer.id === activeOfferId;
      const icon = isActive ? activeIcon : defaultIcon;

      L.marker(
        [offer.location.latitude, offer.location.longitude],
        { icon }
      ).addTo(markersLayerRef.current as LayerGroup);
    });
  }, [offers, activeOfferId]);

  return (
    <div
      className="cities__map map"
      ref={mapContainerRef}
      style={{ height: '500px' }}
    />
  );
}

export default Map;
