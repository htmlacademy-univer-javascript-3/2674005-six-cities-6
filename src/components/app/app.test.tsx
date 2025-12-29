import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
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

const createMockStore = (initialState: Partial<RootState>) => configureStore({
  reducer: {
    user: userSlice.reducer,
    offers: offersSlice.reducer,
    offerDetails: offerDetailsSlice.reducer
  },
  preloadedState: initialState
});

describe('App Routing', () => {
  it('should render MainPage when navigating to "/"', () => {
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
                  <FavoritesPage offers={[]} />
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
        favorites: [],
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
                  <FavoritesPage offers={[]} />
                </PrivateRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole('heading', { name: /Избранное/i })).toBeInTheDocument();
  });
});
