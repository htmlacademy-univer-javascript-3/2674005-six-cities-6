import { createSlice } from '@reduxjs/toolkit';
import { fetchOfferDetails, fetchNearbyOffers, fetchComments, postComment, toggleFavorite } from '../api-actions';
import type { Offer } from '../../types/offer';
import type { Comment } from '../../types/comment';

type OfferDetailsState = {
  currentOffer: Offer | null;
  nearbyOffers: Offer[];
  comments: Comment[];
  isOfferLoading: boolean;
  isCommentsLoading: boolean;
  hasOfferError: boolean;
};

const initialState: OfferDetailsState = {
  currentOffer: null,
  nearbyOffers: [],
  comments: [],
  isOfferLoading: false,
  isCommentsLoading: false,
  hasOfferError: false
};

export const offerDetailsSlice = createSlice({
  name: 'offerDetails',
  initialState,
  reducers: {
    clearCurrentOffer: (state) => {
      state.currentOffer = null;
      state.nearbyOffers = [];
      state.comments = [];
      state.hasOfferError = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOfferDetails.pending, (state) => {
        state.isOfferLoading = true;
        state.hasOfferError = false;
      })
      .addCase(fetchOfferDetails.fulfilled, (state, action) => {
        state.currentOffer = action.payload;
        state.isOfferLoading = false;
        state.hasOfferError = false;
      })
      .addCase(fetchOfferDetails.rejected, (state) => {
        state.isOfferLoading = false;
        state.currentOffer = null;
        state.hasOfferError = true;
      })
      .addCase(fetchNearbyOffers.fulfilled, (state, action) => {
        state.nearbyOffers = action.payload;
      })
      .addCase(fetchComments.pending, (state) => {
        state.isCommentsLoading = true;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments = action.payload;
        state.isCommentsLoading = false;
      })
      .addCase(fetchComments.rejected, (state) => {
        state.isCommentsLoading = false;
      })
      .addCase(postComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const updatedOffer = action.payload;
        // Update current offer if it matches
        if (state.currentOffer && state.currentOffer.id === updatedOffer.id) {
          state.currentOffer = updatedOffer;
        }
        // Update nearby offers if any match
        const nearbyIndex = state.nearbyOffers.findIndex((offer) => offer.id === updatedOffer.id);
        if (nearbyIndex !== -1) {
          state.nearbyOffers[nearbyIndex] = updatedOffer;
        }
      });
  }
});

export const { clearCurrentOffer } = offerDetailsSlice.actions;
