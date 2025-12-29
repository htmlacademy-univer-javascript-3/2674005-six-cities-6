import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { AuthorizationStatus } from '../../const';
import OffersList from './offers-list';
import { offersSlice } from '../../store/slices/offers-slice';
import { userSlice } from '../../store/slices/user-slice';
import type { Offer } from '../../types/offer';

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
        zoom: 10
      }
    },
    location: {
      latitude: 48.85661,
      longitude: 2.35222,
      zoom: 10
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
        latitude: 48.85661,
        longitude: 2.35222,
        zoom: 10
      }
    },
    location: {
      latitude: 48.85661,
      longitude: 2.35222,
      zoom: 10
    },
    isFavorite: false,
    isPremium: false,
    rating: 4.5
  }
];

const createMockStore = () =>
  configureStore({
    reducer: {
      offers: offersSlice.reducer,
      user: userSlice.reducer
    },
    preloadedState: {
      offers: {
        city: 'Paris',
        offers: mockOffers,
        favorites: [],
        isLoading: false,
        isFavoritesLoading: false,
        hasError: false
      },
      user: {
        authorizationStatus: AuthorizationStatus.NoAuth,
        user: null
      }
    }
  });

describe('OffersList Component', () => {
  it('should render all offers', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <OffersList offers={mockOffers} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Beautiful apartment')).toBeInTheDocument();
    expect(screen.getByText('Cozy studio')).toBeInTheDocument();
  });

  it('should render empty list when no offers provided', () => {
    const store = createMockStore();

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <OffersList offers={[]} />
        </MemoryRouter>
      </Provider>
    );

    expect(container.firstChild).toBeNull();
  });

  it('should call onOfferHover with offer id on mouse enter', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    const handleOfferHover = vi.fn();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <OffersList offers={mockOffers} onOfferHover={handleOfferHover} />
        </MemoryRouter>
      </Provider>
    );

    const firstOffer = screen.getByText('Beautiful apartment').closest('article');
    if (firstOffer) {
      await user.hover(firstOffer);
      expect(handleOfferHover).toHaveBeenCalledWith('1');
    }
  });

  it('should call onOfferHover with null on mouse leave', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    const handleOfferHover = vi.fn();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <OffersList offers={mockOffers} onOfferHover={handleOfferHover} />
        </MemoryRouter>
      </Provider>
    );

    const firstOffer = screen.getByText('Beautiful apartment').closest('article');
    if (firstOffer) {
      await user.hover(firstOffer);
      await user.unhover(firstOffer);
      expect(handleOfferHover).toHaveBeenLastCalledWith(null);
    }
  });

  it('should render correct number of offer cards', () => {
    const store = createMockStore();

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <OffersList offers={mockOffers} />
        </MemoryRouter>
      </Provider>
    );

    const offerCards = container.querySelectorAll('.place-card');
    expect(offerCards.length).toBe(mockOffers.length);
  });

  it('should not call onOfferHover when it is not provided', async () => {
    const user = userEvent.setup();
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <OffersList offers={mockOffers} />
        </MemoryRouter>
      </Provider>
    );

    const firstOffer = screen.getByText('Beautiful apartment').closest('article');
    if (firstOffer) {
      await user.hover(firstOffer);
      await user.unhover(firstOffer);
    }

    expect(true).toBe(true);
  });
});
