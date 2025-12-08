import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchOffers, toggleFavorite, fetchFavorites } from '../api-actions';
import type { Offer } from '../../types/offer';

type OffersState = {
  city: string;
  offers: Offer[];
  isLoading: boolean;
  hasError: boolean;
  favorites: Offer[];
  isFavoritesLoading: boolean;
};

const initialState: OffersState = {
  city: 'Paris',
  offers: [],
  isLoading: false,
  hasError: false,
  favorites: [],
  isFavoritesLoading: false
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
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const updatedOffer = action.payload;
        // Update in offers list
        const offerIndex = state.offers.findIndex((offer) => offer.id === updatedOffer.id);
        if (offerIndex !== -1) {
          state.offers[offerIndex] = updatedOffer;
        }
        // Update in favorites list
        if (updatedOffer.isFavorite) {
          state.favorites.push(updatedOffer);
        } else {
          state.favorites = state.favorites.filter((offer) => offer.id !== updatedOffer.id);
        }
      })
      .addCase(fetchFavorites.pending, (state) => {
        state.isFavoritesLoading = true;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload;
        state.isFavoritesLoading = false;
      })
      .addCase(fetchFavorites.rejected, (state) => {
        state.isFavoritesLoading = false;
      });
  }
});

export const { changeCity } = offersSlice.actions;
