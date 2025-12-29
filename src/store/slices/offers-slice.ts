import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchOffers } from '../api-actions';
import type { Offer } from '../../types/offer';

type OffersState = {
  city: string;
  offers: Offer[];
  favorites: Offer[];
  isLoading: boolean;
  isFavoritesLoading: boolean;
  hasError: boolean;
};

const initialState: OffersState = {
  city: 'Paris',
  offers: [],
  favorites: [],
  isLoading: false,
  isFavoritesLoading: false,
  hasError: false
};

export const offersSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {
    changeCity: (state, action: PayloadAction<string>) => {
      state.city = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
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
  }
});

export const { changeCity } = offersSlice.actions;
