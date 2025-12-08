import { createReducer } from '@reduxjs/toolkit';
import { changeCity, requireAuthorization } from './action';
import { fetchOffers, checkAuth, login } from './api-actions';
import { AuthorizationStatus } from '../const';
import type { Offer } from '../types/offer';
import type { User } from '../types/user';

type State = {
  city: string;
  offers: Offer[];
  isLoading: boolean;
  hasError: boolean;
  authorizationStatus: AuthorizationStatus;
  user: User | null;
};

const initialState: State = {
  city: 'Paris',
  offers: [],
  isLoading: false,
  hasError: false,
  authorizationStatus: AuthorizationStatus.Unknown,
  user: null
};

export const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(changeCity, (state, action) => {
      state.city = action.payload;
    })
    .addCase(requireAuthorization, (state, action) => {
      state.authorizationStatus = action.payload;
    })
    .addCase(fetchOffers.pending, (state) => {
      state.isLoading = true;
      state.hasError = false;
    })
    .addCase(fetchOffers.fulfilled, (state, action) => {
      state.offers = action.payload;
      state.isLoading = false;
    })
    .addCase(fetchOffers.rejected, (state) => {
      state.isLoading = false;
      state.hasError = true;
    })
    .addCase(checkAuth.fulfilled, (state, action) => {
      state.authorizationStatus = AuthorizationStatus.Auth;
      state.user = action.payload;
    })
    .addCase(checkAuth.rejected, (state) => {
      state.authorizationStatus = AuthorizationStatus.NoAuth;
    })
    .addCase(login.fulfilled, (state, action) => {
      state.authorizationStatus = AuthorizationStatus.Auth;
      state.user = action.payload;
    })
    .addCase(login.rejected, (state) => {
      state.authorizationStatus = AuthorizationStatus.NoAuth;
    });
});
