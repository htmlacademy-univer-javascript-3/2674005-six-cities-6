import { describe, it, expect, afterEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { APIRoute } from '../const';
import { userSlice } from './slices/user-slice';
import { offersSlice } from './slices/offers-slice';
import { offerDetailsSlice } from './slices/offer-details-slice';
import {
  fetchOffers,
  checkAuth,
  login,
  logout,
  fetchOfferDetails,
  fetchNearbyOffers,
  fetchComments,
  postComment
} from './api-actions';

const api = axios.create({ baseURL: 'https://14.design.htmlacademy.pro/six-cities' });
const mockAxiosAdapter = new MockAdapter(api);

const createMockStore = () => configureStore({
  reducer: {
    user: userSlice.reducer,
    offers: offersSlice.reducer,
    offerDetails: offerDetailsSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: api
      }
    })
});

describe('Async actions', () => {
  afterEach(() => {
    mockAxiosAdapter.reset();
  });

  describe('fetchOffers', () => {
    it('should dispatch fetchOffers.fulfilled when GET /offers succeeds', async () => {
      const mockOffers = [
        {
          id: '1',
          title: 'Test Offer',
          type: 'apartment',
          price: 100,
          previewImage: 'test.jpg',
          city: {
            name: 'Paris',
            location: { latitude: 48.8566, longitude: 2.3522, zoom: 12 }
          },
          location: { latitude: 48.8566, longitude: 2.3522, zoom: 12 },
          isFavorite: false,
          isPremium: false,
          rating: 4.5
        }
      ];

      mockAxiosAdapter.onGet(APIRoute.Offers).reply(200, mockOffers);

      const store = createMockStore();
      await store.dispatch(fetchOffers());

      const state = store.getState();
      expect(state.offers.offers).toEqual(
        mockOffers.map((offer) => ({ ...offer, image: offer.previewImage }))
      );
      expect(state.offers.isLoading).toBe(false);
      expect(state.offers.hasError).toBe(false);
    });

    it('should dispatch fetchOffers.rejected when GET /offers fails', async () => {
      mockAxiosAdapter.onGet(APIRoute.Offers).reply(400);

      const store = createMockStore();
      await store.dispatch(fetchOffers());

      const state = store.getState();
      expect(state.offers.isLoading).toBe(false);
      expect(state.offers.hasError).toBe(true);
    });
  });

  describe('checkAuth', () => {
    it('should dispatch checkAuth.fulfilled when GET /login succeeds', async () => {
      const mockUser = {
        name: 'John Doe',
        avatarUrl: 'avatar.jpg',
        isPro: false,
        email: 'test@test.com',
        token: 'test-token'
      };

      mockAxiosAdapter.onGet(APIRoute.Login).reply(200, mockUser);

      const store = createMockStore();
      await store.dispatch(checkAuth());

      const state = store.getState();
      expect(state.user.user).toEqual(mockUser);
    });

    it('should dispatch checkAuth.rejected when GET /login fails', async () => {
      mockAxiosAdapter.onGet(APIRoute.Login).reply(401);

      const store = createMockStore();
      await store.dispatch(checkAuth());

      const state = store.getState();
      expect(state.user.authorizationStatus).toBe('NO_AUTH');
    });
  });

  describe('login', () => {
    it('should dispatch login.fulfilled when POST /login succeeds', async () => {
      const mockUser = {
        name: 'John Doe',
        avatarUrl: 'avatar.jpg',
        isPro: false,
        email: 'test@test.com',
        token: 'test-token'
      };

      const authData = { email: 'test@test.com', password: 'password123' };

      mockAxiosAdapter.onPost(APIRoute.Login).reply(200, mockUser);

      const store = createMockStore();
      await store.dispatch(login(authData));

      const state = store.getState();
      expect(state.user.user).toEqual(mockUser);
    });

    it('should dispatch login.rejected when POST /login fails', async () => {
      const authData = { email: 'test@test.com', password: 'wrong' };

      mockAxiosAdapter.onPost(APIRoute.Login).reply(400);

      const store = createMockStore();
      await store.dispatch(login(authData));

      const state = store.getState();
      expect(state.user.authorizationStatus).toBe('NO_AUTH');
    });
  });

  describe('logout', () => {
    it('should dispatch logout.fulfilled when DELETE /logout succeeds', async () => {
      mockAxiosAdapter.onDelete(APIRoute.Logout).reply(204);

      const store = createMockStore();
      await store.dispatch(logout());

      const state = store.getState();
      expect(state.user.authorizationStatus).toBe('NO_AUTH');
      expect(state.user.user).toBeNull();
    });

    it('should dispatch logout.rejected when DELETE /logout fails', async () => {
      mockAxiosAdapter.onDelete(APIRoute.Logout).reply(400);

      const store = createMockStore();
      await store.dispatch(logout());

      const state = store.getState();
      expect(state.user.authorizationStatus).not.toBe('AUTH');
    });
  });

  describe('fetchOfferDetails', () => {
    it('should dispatch fetchOfferDetails.fulfilled when GET /offers/:id succeeds', async () => {
      const mockOffer = {
        id: '1',
        title: 'Test Offer',
        type: 'apartment',
        price: 100,
        previewImage: 'test.jpg',
        city: {
          name: 'Paris',
          location: { latitude: 48.8566, longitude: 2.3522, zoom: 12 }
        },
        location: { latitude: 48.8566, longitude: 2.3522, zoom: 12 },
        isFavorite: false,
        isPremium: false,
        rating: 4.5
      };

      mockAxiosAdapter.onGet(`${APIRoute.Offers}/1`).reply(200, mockOffer);

      const store = createMockStore();
      await store.dispatch(fetchOfferDetails('1'));

      const state = store.getState();
      expect(state.offerDetails.currentOffer).toEqual({ ...mockOffer, image: mockOffer.previewImage });
    });

    it('should dispatch fetchOfferDetails.rejected when GET /offers/:id fails', async () => {
      mockAxiosAdapter.onGet(`${APIRoute.Offers}/1`).reply(404);

      const store = createMockStore();
      await store.dispatch(fetchOfferDetails('1'));

      const state = store.getState();
      expect(state.offerDetails.hasOfferError).toBe(true);
    });
  });

  describe('fetchNearbyOffers', () => {
    it('should dispatch fetchNearbyOffers.fulfilled when GET /offers/:id/nearby succeeds', async () => {
      const mockOffers = [
        {
          id: '2',
          title: 'Nearby Offer',
          type: 'apartment',
          price: 120,
          previewImage: 'nearby.jpg',
          city: {
            name: 'Paris',
            location: { latitude: 48.8566, longitude: 2.3522, zoom: 12 }
          },
          location: { latitude: 48.8566, longitude: 2.3522, zoom: 12 },
          isFavorite: false,
          isPremium: false,
          rating: 4.0
        }
      ];

      mockAxiosAdapter.onGet(`${APIRoute.Offers}/1${APIRoute.Nearby}`).reply(200, mockOffers);

      const store = createMockStore();
      await store.dispatch(fetchNearbyOffers('1'));

      const state = store.getState();
      expect(state.offerDetails.nearbyOffers).toEqual(
        mockOffers.map((offer) => ({ ...offer, image: offer.previewImage }))
      );
    });
  });

  describe('fetchComments', () => {
    it('should dispatch fetchComments.fulfilled when GET /comments/:id succeeds', async () => {
      const mockComments = [
        {
          id: '1',
          date: '2024-01-01',
          user: {
            name: 'User',
            avatarUrl: 'avatar.jpg',
            isPro: false
          },
          comment: 'Great place!',
          rating: 5
        }
      ];

      mockAxiosAdapter.onGet(`${APIRoute.Comments}/1`).reply(200, mockComments);

      const store = createMockStore();
      await store.dispatch(fetchComments('1'));

      const state = store.getState();
      expect(state.offerDetails.comments).toEqual(mockComments);
    });

    it('should dispatch fetchComments.rejected when GET /comments/:id fails', async () => {
      mockAxiosAdapter.onGet(`${APIRoute.Comments}/1`).reply(400);

      const store = createMockStore();
      await store.dispatch(fetchComments('1'));

      const state = store.getState();
      expect(state.offerDetails.isCommentsLoading).toBe(false);
    });
  });

  describe('postComment', () => {
    it('should dispatch postComment.fulfilled when POST /comments/:id succeeds', async () => {
      const newComment = { comment: 'Nice place!', rating: 4 };
      const mockResponse = {
        id: '2',
        date: '2024-01-02',
        user: {
          name: 'Another User',
          avatarUrl: 'avatar2.jpg',
          isPro: true
        },
        comment: 'Nice place!',
        rating: 4
      };

      mockAxiosAdapter.onPost(`${APIRoute.Comments}/1`).reply(200, mockResponse);

      const store = createMockStore();
      await store.dispatch(postComment({ offerId: '1', comment: newComment }));

      const state = store.getState();
      expect(state.offerDetails.comments).toContainEqual(mockResponse);
    });

    it('should dispatch postComment.rejected when POST /comments/:id fails', async () => {
      const newComment = { comment: 'Nice place!', rating: 4 };

      mockAxiosAdapter.onPost(`${APIRoute.Comments}/1`).reply(400);

      const store = createMockStore();
      const initialCommentsLength = store.getState().offerDetails.comments.length;
      
      await store.dispatch(postComment({ offerId: '1', comment: newComment }));

      const state = store.getState();
      expect(state.offerDetails.comments.length).toBe(initialCommentsLength);
    });
  });
});
