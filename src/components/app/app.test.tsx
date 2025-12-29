import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { AuthorizationStatus } from '../../const';
import { userSlice } from '../../store/slices/user-slice';
import { offersSlice } from '../../store/slices/offers-slice';
import { offerDetailsSlice } from '../../store/slices/offer-details-slice';
import MainPage from '../main-page/main-page';
import LoginPage from '../login-page/login-page';
import FavoritesPage from '../favorites-page/favorites-page';
import NotFoundPage from '../not-found-page/not-found-page';
import PrivateRoute from '../private-route/private-route';
import type { RootState } from '../../store';
import type { Offer } from '../../types/offer';

// Mock api-actions to prevent side effects
vi.mock('../../store/api-actions', async () => {
  const actual = await vi.importActual('../../store/api-actions');
  const mockFetchFavorites = Object.assign(
    vi.fn(() => ({ type: 'mock/fetchFavorites' })),
    {
      pending: { type: 'mock/fetchFavorites/pending', toString: () => 'mock/fetchFavorites/pending' },
      fulfilled: { type: 'mock/fetchFavorites/fulfilled', toString: () => 'mock/fetchFavorites/fulfilled' },
      rejected: { type: 'mock/fetchFavorites/rejected', toString: () => 'mock/fetchFavorites/rejected' }
    }
  );
  
  return {
    ...actual,
    fetchFavorites: mockFetchFavorites,
  };
});

const mockOffer: Offer = {
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

const createMockStore = (initialState: Partial<RootState>) => configureStore({
  reducer: combineReducers({
    user: userSlice.reducer,
    offers: offersSlice.reducer,
    offerDetails: offerDetailsSlice.reducer
  }),
  preloadedState: initialState
});

describe('App Routing', () => {
  it('should render MainPage when navigating to "/"', () => {
    const store = createMockStore({
      offers: {
        city: 'Paris',
        offers: [mockOffer],
        favorites: [],
        isLoading: false,
        isFavoritesLoading: false,
        hasError: false
      },
      user: {
        authorizationStatus: AuthorizationStatus.NoAuth,
        user: null
      },
      offerDetails: {
        currentOffer: null,
        nearbyOffers: [],
        comments: [],
        isOfferLoading: false,
        isCommentsLoading: false,
        hasOfferError: false
      }
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<MainPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/places to stay in/i)).toBeInTheDocument();
  });

  it('should render LoginPage when navigating to "/login"', () => {
    const store = createMockStore({
      offers: {
        city: 'Paris',
        offers: [],
        favorites: [],
        isLoading: false,
        isFavoritesLoading: false,
        hasError: false
      },
      user: {
        authorizationStatus: AuthorizationStatus.NoAuth,
        user: null
      },
      offerDetails: {
        currentOffer: null,
        nearbyOffers: [],
        comments: [],
        isOfferLoading: false,
        isCommentsLoading: false,
        hasOfferError: false
      }
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole('heading', { name: /Sign in/i })).toBeInTheDocument();
  });

  it('should render NotFoundPage when navigating to "/404"', () => {
    const store = createMockStore({
      offers: {
        city: 'Paris',
        offers: [],
        favorites: [],
        isLoading: false,
        isFavoritesLoading: false,
        hasError: false
      },
      user: {
        authorizationStatus: AuthorizationStatus.NoAuth,
        user: null
      },
      offerDetails: {
        currentOffer: null,
        nearbyOffers: [],
        comments: [],
        isOfferLoading: false,
        isCommentsLoading: false,
        hasOfferError: false
      }
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/404']}>
          <Routes>
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page not found')).toBeInTheDocument();
  });

  it('should render NotFoundPage for unknown routes', () => {
    const store = createMockStore({
      offers: {
        city: 'Paris',
        offers: [],
        favorites: [],
        isLoading: false,
        isFavoritesLoading: false,
        hasError: false
      },
      user: {
        authorizationStatus: AuthorizationStatus.NoAuth,
        user: null
      },
      offerDetails: {
        currentOffer: null,
        nearbyOffers: [],
        comments: [],
        isOfferLoading: false,
        isCommentsLoading: false,
        hasOfferError: false
      }
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/unknown-route']}>
          <Routes>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('should redirect to "/login" when accessing "/favorites" without authorization', () => {
    const store = createMockStore({
      offers: {
        city: 'Paris',
        offers: [],
        favorites: [],
        isLoading: false,
        isFavoritesLoading: false,
        hasError: false
      },
      user: {
        authorizationStatus: AuthorizationStatus.NoAuth,
        user: null
      },
      offerDetails: {
        currentOffer: null,
        nearbyOffers: [],
        comments: [],
        isOfferLoading: false,
        isCommentsLoading: false,
        hasOfferError: false
      }
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/favorites']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/favorites"
              element={
                <PrivateRoute>
                  <FavoritesPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole('heading', { name: /Sign in/i })).toBeInTheDocument();
  });

  it('should render FavoritesPage when accessing "/favorites" with authorization', () => {
    const store = createMockStore({
      offers: {
        city: 'Paris',
        offers: [],
        favorites: [mockOffer],
        isLoading: false,
        isFavoritesLoading: false,
        hasError: false
      },
      user: {
        authorizationStatus: AuthorizationStatus.Auth,
        user: {
          name: 'John Doe',
          avatarUrl: 'avatar.jpg',
          isPro: false,
          email: 'test@test.com',
          token: 'test-token'
        }
      },
      offerDetails: {
        currentOffer: null,
        nearbyOffers: [],
        comments: [],
        isOfferLoading: false,
        isCommentsLoading: false,
        hasOfferError: false
      }
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/favorites']}>
          <Routes>
            <Route
              path="/favorites"
              element={
                <PrivateRoute>
                  <FavoritesPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole('heading', { name: /Saved listing/i })).toBeInTheDocument();
  });
});
