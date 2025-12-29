import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import Map from './map';
import type { Offer } from '../../types/offer';

// Mock leaflet
vi.mock('leaflet', () => ({
  default: {
    map: vi.fn(() => ({
      setView: vi.fn(() => ({
        addLayer: vi.fn()
      })),
      flyTo: vi.fn(),
      remove: vi.fn()
    })),
    tileLayer: vi.fn(() => ({
      addTo: vi.fn()
    })),
    marker: vi.fn(() => ({
      addTo: vi.fn(function(this: Record<string, unknown>) {
        return this;
      }),
      setIcon: vi.fn(),
      remove: vi.fn()
    })),
    icon: vi.fn((options: unknown) => options)
  },
  Map: vi.fn(),
  Marker: vi.fn()
}));

const mockOffers: Offer[] = [
  {
    id: '1',
    title: 'Beautiful apartment',
    type: 'apartment',
    price: 120,
    previewImage: 'img/apartment-01.jpg',
    city: {
      name: 'Paris',
      location: {
        latitude: 48.85661,
        longitude: 2.35222,
        zoom: 13
      }
    },
    location: {
      latitude: 48.85661,
      longitude: 2.35222,
      zoom: 13
    },
    isFavorite: false,
    isPremium: true,
    rating: 4.8
  },
  {
    id: '2',
    title: 'Cozy studio',
    type: 'room',
    price: 80,
    previewImage: 'img/room.jpg',
    city: {
      name: 'Paris',
      location: {
        latitude: 48.86661,
        longitude: 2.36222,
        zoom: 13
      }
    },
    location: {
      latitude: 48.86661,
      longitude: 2.36222,
      zoom: 13
    },
    isFavorite: false,
    isPremium: false,
    rating: 4.5
  }
];

describe('Map Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render map container', () => {
    const { container } = render(<Map offers={mockOffers} />);
    
    const mapContainer = container.querySelector('.map');
    expect(mapContainer).toBeInTheDocument();
  });

  it('should render with empty offers array', () => {
    const { container } = render(<Map offers={[]} />);
    
    const mapContainer = container.querySelector('.map');
    expect(mapContainer).toBeInTheDocument();
  });

  it('should render with active offer id', () => {
    const { container } = render(<Map offers={mockOffers} activeOfferId="1" />);
    
    const mapContainer = container.querySelector('.map');
    expect(mapContainer).toBeInTheDocument();
  });

  it('should update when offers change', () => {
    const { rerender, container } = render(<Map offers={mockOffers} />);
    
    const newOffers: Offer[] = [
      {
        ...mockOffers[0],
        id: '3',
        title: 'New apartment'
      }
    ];
    
    rerender(<Map offers={newOffers} />);
    
    const mapContainer = container.querySelector('.map');
    expect(mapContainer).toBeInTheDocument();
  });

  it('should update when active offer changes', () => {
    const { rerender, container } = render(<Map offers={mockOffers} activeOfferId="1" />);
    
    rerender(<Map offers={mockOffers} activeOfferId="2" />);
    
    const mapContainer = container.querySelector('.map');
    expect(mapContainer).toBeInTheDocument();
  });
});
