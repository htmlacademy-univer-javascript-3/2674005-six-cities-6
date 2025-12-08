import { createReducer } from '@reduxjs/toolkit';
import { changeCity } from './action';
import { fetchOffers } from './api-actions';
import type { Offer } from '../types/offer';

type State = {
  city: string;
  offers: Offer[];
  isLoading: boolean;
  hasError: boolean;
};

const initialState: State = {
  city: 'Paris',
  offers: [],
  isLoading: false,
  hasError: false
};

export const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(changeCity, (state, action) => {
      state.city = action.payload;
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
    });
});
