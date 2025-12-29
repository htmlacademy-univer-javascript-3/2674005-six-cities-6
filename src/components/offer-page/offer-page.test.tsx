import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { AuthorizationStatus } from '../../const';
import { userSlice } from '../../store/slices/user-slice';
import { offersSlice } from '../../store/slices/offers-slice';
import { offerDetailsSlice } from '../../store/slices/offer-details-slice';
import OfferPage from './offer-page';
import type { Offer } from '../../types/offer';
import type { Comment } from '../../types/comment';

// Mock API actions
vi.mock('../../store/api-actions', async () => {
  const actual = await vi.importActual('../../store/api-actions');
  const createMockAsyncThunk = (type: string) => {
    const thunk = Object.assign(
      vi.fn((payload: unknown) => ({
        type,
        payload
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
    fetchOfferDetails: createMockAsyncThunk('offer/fetchDetails'),
    fetchNearbyOffers: createMockAsyncThunk('offer/fetchNearby'),
    fetchComments: createMockAsyncThunk('comments/fetch'),
    logout: createMockAsyncThunk('user/logout'),
    toggleFavorite: createMockAsyncThunk('favorites/toggle')
  };
});

const mockOffer: Offer = {
  id: '1',
  title: 'Beautiful apartment',
  type: 'apartment',
  price: 120,
  previewImage: 'img/apartment-01.jpg',
  images: ['img/apartment-01.jpg', 'img/apartment-02.jpg'],
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
  rating: 4.8,
  description: 'A great place to stay',
  bedrooms: 3,
  maxAdults: 6,
  goods: ['Wi-Fi', 'Kitchen'],
  host: {
    name: 'John',
    avatarUrl: 'avatar.jpg',
    isPro: true
  }
};

const mockComments: Comment[] = [
  {
    id: '1',
    comment: 'Great place!',
    date: '2024-01-01',
    rating: 5,
    user: {
      name: 'Alice',
      avatarUrl: 'alice.jpg',
      isPro: false
    }
  }
];

const createMockStore = (
  offer: Offer | null,
  comments: Comment[],
  isLoading: boolean,
  hasError: boolean,
  authStatus: AuthorizationStatus
) =>
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
        favorites: [],
        isLoading: false,
        isFavoritesLoading: false,
        hasError: false
      },
      offerDetails: {
        currentOffer: offer,
        nearbyOffers: [],
        comments,
        isOfferLoading: isLoading,
        isCommentsLoading: false,
        hasOfferError: hasError
      }
    }
  });

describe('OfferPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading spinner when offer is loading', () => {
    const store = createMockStore(null, [], true, false, AuthorizationStatus.NoAuth);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/offer/1']}>
          <Routes>
            <Route path="/offer/:id" element={<OfferPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render offer details when offer is loaded', () => {
    const store = createMockStore(mockOffer, mockComments, false, false, AuthorizationStatus.Auth);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/offer/1']}>
          <Routes>
            <Route path="/offer/:id" element={<OfferPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Beautiful apartment')).toBeInTheDocument();
    expect(screen.getByText('€120')).toBeInTheDocument();
    expect(screen.getByText('A great place to stay')).toBeInTheDocument();
  });

  it('should render premium badge when offer is premium', () => {
    const store = createMockStore(mockOffer, mockComments, false, false, AuthorizationStatus.Auth);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/offer/1']}>
          <Routes>
            <Route path="/offer/:id" element={<OfferPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('should render review form when user is authorized', () => {
    const store = createMockStore(mockOffer, mockComments, false, false, AuthorizationStatus.Auth);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/offer/1']}>
          <Routes>
            <Route path="/offer/:id" element={<OfferPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByPlaceholderText(/Tell how was your stay/i)).toBeInTheDocument();
  });

  it('should not render review form when user is not authorized', () => {
    const store = createMockStore(mockOffer, mockComments, false, false, AuthorizationStatus.NoAuth);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/offer/1']}>
          <Routes>
            <Route path="/offer/:id" element={<OfferPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByPlaceholderText(/Tell how was your stay/i)).not.toBeInTheDocument();
  });

  it('should render comments list', () => {
    const store = createMockStore(mockOffer, mockComments, false, false, AuthorizationStatus.Auth);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/offer/1']}>
          <Routes>
            <Route path="/offer/:id" element={<OfferPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Great place!')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('should render host information', () => {
    const store = createMockStore(mockOffer, mockComments, false, false, AuthorizationStatus.Auth);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/offer/1']}>
          <Routes>
            <Route path="/offer/:id" element={<OfferPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('John')).toBeInTheDocument();
  });

  it('should render offer amenities', () => {
    const store = createMockStore(mockOffer, mockComments, false, false, AuthorizationStatus.Auth);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/offer/1']}>
          <Routes>
            <Route path="/offer/:id" element={<OfferPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Wi-Fi')).toBeInTheDocument();
    expect(screen.getByText('Kitchen')).toBeInTheDocument();
  });
});
