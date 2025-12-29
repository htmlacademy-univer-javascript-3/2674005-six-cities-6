import { describe, it, expect } from 'vitest';
import { offersSlice, changeCity } from './offers-slice';
import { fetchOffers } from '../api-actions';

const initialState = {
  city: 'Paris',
  offers: [],
  favorites: [],
  isLoading: false,
  isFavoritesLoading: false,
  hasError: false
};

describe('offersSlice', () => {
  it('should return initial state', () => {
    expect(offersSlice.reducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(initialState);
  });

  it('should handle changeCity', () => {
    const newCity = 'Amsterdam';
    const state = offersSlice.reducer(initialState, changeCity(newCity));
    expect(state.city).toBe(newCity);
  });

  it('should handle fetchOffers.pending', () => {
    const state = offersSlice.reducer(initialState, fetchOffers.pending('', undefined));
    expect(state.isLoading).toBe(true);
    expect(state.hasError).toBe(false);
  });

  it('should handle fetchOffers.fulfilled', () => {
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
    const state = offersSlice.reducer(
      { ...initialState, isLoading: true },
      fetchOffers.fulfilled(mockOffers, '', undefined)
    );
    expect(state.offers).toEqual(mockOffers);
    expect(state.isLoading).toBe(false);
    expect(state.hasError).toBe(false);
  });

  it('should handle fetchOffers.rejected', () => {
    const state = offersSlice.reducer(
      { ...initialState, isLoading: true },
      fetchOffers.rejected(null, '', undefined)
    );
    expect(state.isLoading).toBe(false);
    expect(state.hasError).toBe(true);
  });
});
