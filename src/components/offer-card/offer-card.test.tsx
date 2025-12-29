import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import OfferCard from './offer-card';
import type { Offer } from '../../types/offer';
import { userSlice } from '../../store/slices/user-slice';
import { AuthorizationStatus } from '../../const';

const mockOffer: Offer = {
  id: '1',
  title: 'Beautiful apartment',
  type: 'apartment',
  price: 120,
  previewImage: '/img/apartment-01.jpg',
  city: {
    name: 'Paris',
    location: {
      latitude: 48.8566,
      longitude: 2.3522,
      zoom: 12
    }
  },
  location: {
    latitude: 48.8566,
    longitude: 2.3522,
    zoom: 12
  },
  isFavorite: false,
  isPremium: false,
  rating: 4.5
};

const createMockStore = () => configureStore({
  reducer: {
    user: userSlice.reducer,
  },
  preloadedState: {
    user: {
      authorizationStatus: AuthorizationStatus.NoAuth,
      user: null
    }
  }
});

describe('OfferCard Component', () => {
  it('should render offer title', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <OfferCard offer={mockOffer} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Beautiful apartment')).toBeInTheDocument();
  });

  it('should render offer price', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <OfferCard offer={mockOffer} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('€120')).toBeInTheDocument();
  });

  it('should render offer type', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <OfferCard offer={mockOffer} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('apartment')).toBeInTheDocument();
  });

  it('should render Premium mark when offer is premium', () => {
    const premiumOffer = { ...mockOffer, isPremium: true };
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <OfferCard offer={premiumOffer} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('should not render Premium mark when offer is not premium', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <OfferCard offer={mockOffer} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.queryByText('Premium')).not.toBeInTheDocument();
  });

  it('should render offer image with correct src and alt', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <OfferCard offer={mockOffer} />
        </BrowserRouter>
      </Provider>
    );

    const image = screen.getByAltText('Beautiful apartment');
    expect(image).toHaveAttribute('src', '/img/apartment-01.jpg');
    expect(image).toHaveAttribute('alt', 'Beautiful apartment');
  });

  it('should have correct link to offer details page', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <OfferCard offer={mockOffer} />
        </BrowserRouter>
      </Provider>
    );

    const links = screen.getAllByRole('link', { name: /Beautiful apartment/i });
    expect(links[0]).toHaveAttribute('href', '/offer/1');
  });

  it('should render bookmark button', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <OfferCard offer={mockOffer} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByRole('button', { name: /To bookmarks/i })).toBeInTheDocument();
  });
});
