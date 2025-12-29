import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { AuthorizationStatus } from '../../const';
import { userSlice } from '../../store/slices/user-slice';
import { offersSlice } from '../../store/slices/offers-slice';
import { offerDetailsSlice } from '../../store/slices/offer-details-slice';
import FavoritesPage from './favorites-page';
import type { Offer } from '../../types/offer';

// Mock fetchFavorites action
vi.mock('../../store/api-actions', async () => {
  const actual = await vi.importActual('../../store/api-actions');
  const createMockAsyncThunk = (type: string) => {
    const thunk = Object.assign(
      vi.fn(() => ({
        type,
        unwrap: vi.fn(() => Promise.resolve())
      })),
      {
        pending: { type: `${type}/pending`, toString: () => `${type}/pending` },
        fulfilled: { type: `${type}/fulfilled`, toString: () => `${type}/fulfilled` },
        rejected: { type: `${type}/rejected`, toString: () => `${type}/rejected` }
      }
    );
    return thunk;
  };
  
  return {
    ...actual,
    fetchFavorites: createMockAsyncThunk('favorites/fetch'),
    logout: createMockAsyncThunk('user/logout')
  };
});

const mockFavoriteOffer: Offer = {
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
  isFavorite: true,
  isPremium: false,
  rating: 4.8
};

const createMockStore = (favorites: Offer[], authStatus: AuthorizationStatus, isLoading = false) =>
  configureStore({
    reducer: combineReducers({
      user: userSlice.reducer,
      offers: offersSlice.reducer,
      offerDetails: offerDetailsSlice.reducer
    }),
    preloadedState: {
      user: {
        authorizationStatus: authStatus,
        user: authStatus === AuthorizationStatus.Auth
          ? {
            name: 'John Doe',
            avatarUrl: 'test-avatar.jpg',
            isPro: false,
            email: 'test@test.com',
            token: 'test-token'
          }
          : null
      },
      offers: {
        city: 'Paris',
        offers: [],
        favorites,
        isLoading: false,
        isFavoritesLoading: isLoading,
        hasError: false
      },
      offerDetails: {
        currentOffer: null,
        nearbyOffers: [],
        comments: [],
        isOfferLoading: false,
        isCommentsLoading: false,
        hasOfferError: false
      }
    }
  });

describe('FavoritesPage Component', () => {
  it('should render favorites page with offers', () => {
    const store = createMockStore([mockFavoriteOffer], AuthorizationStatus.Auth);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoritesPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Saved listing')).toBeInTheDocument();
    expect(screen.getByText('Beautiful apartment')).toBeInTheDocument();
  });

  it('should render empty favorites page when no favorites', () => {
    const store = createMockStore([], AuthorizationStatus.Auth);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoritesPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Nothing yet saved.')).toBeInTheDocument();
    expect(screen.getByText(/Save properties to narrow down search/i)).toBeInTheDocument();
  });

  it('should show loading spinner when favorites are loading', () => {
    const store = createMockStore([], AuthorizationStatus.Auth, true);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoritesPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render user email when authorized', () => {
    const store = createMockStore([mockFavoriteOffer], AuthorizationStatus.Auth);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoritesPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('test@test.com')).toBeInTheDocument();
  });

  it('should render favorite count', () => {
    const store = createMockStore([mockFavoriteOffer], AuthorizationStatus.Auth);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoritesPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should render sign in link when not authorized', () => {
    const store = createMockStore([], AuthorizationStatus.NoAuth);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoritesPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('should render sign out button when authorized', () => {
    const store = createMockStore([mockFavoriteOffer], AuthorizationStatus.Auth);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoritesPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Sign out')).toBeInTheDocument();
  });

  it('should render footer with logo', () => {
    const store = createMockStore([], AuthorizationStatus.Auth);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoritesPage />
        </MemoryRouter>
      </Provider>
    );

    const logos = screen.getAllByAltText('6 cities logo');
    expect(logos.length).toBeGreaterThan(0);
  });

  it('should group favorites by city', () => {
    const parisOffer = mockFavoriteOffer;
    const cologneOffer: Offer = {
      ...mockFavoriteOffer,
      id: '2',
      title: 'Nice hotel',
      city: {
        name: 'Cologne',
        location: {
          latitude: 50.9375,
          longitude: 6.9603,
          zoom: 10
        }
      }
    };

    const store = createMockStore([parisOffer, cologneOffer], AuthorizationStatus.Auth);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoritesPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('Cologne')).toBeInTheDocument();
  });
});
