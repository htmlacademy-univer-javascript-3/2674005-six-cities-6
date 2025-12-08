import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AxiosInstance } from 'axios';
import { APIRoute } from '../const';
import type { Offer } from '../types/offer';
import type { User, AuthData } from '../types/user';
import type { Comment, NewComment } from '../types/comment';

const TOKEN_KEY = 'six-cities-token';

export const saveToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string => {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ?? '';
};

export const dropToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

export const fetchOffers = createAsyncThunk<
  Offer[],
  undefined,
  { extra: AxiosInstance }
>(
  'offers/fetchOffers',
  async (_arg, { extra: api }) => {
    const { data } = await api.get<Offer[]>(APIRoute.Offers);
    // Map previewImage to image for compatibility with components
    return data.map((offer) => ({
      ...offer,
      image: offer.previewImage
    }));
  }
);

export const checkAuth = createAsyncThunk<
  User,
  undefined,
  { extra: AxiosInstance }
>(
  'user/checkAuth',
  async (_arg, { extra: api }) => {
    const { data } = await api.get<User>(APIRoute.Login);
    return data;
  }
);

export const login = createAsyncThunk<
  User,
  AuthData,
  { extra: AxiosInstance }
>(
  'user/login',
  async ({ email, password }, { extra: api }) => {
    const { data } = await api.post<User>(APIRoute.Login, { email, password });
    saveToken(data.token);
    return data;
  }
);

export const logout = createAsyncThunk<
  void,
  undefined,
  { extra: AxiosInstance }
>(
  'user/logout',
  async (_arg, { extra: api }) => {
    await api.delete(APIRoute.Logout);
    dropToken();
  }
);

export const fetchOfferDetails = createAsyncThunk<
  Offer,
  string,
  { extra: AxiosInstance }
>(
  'offer/fetchDetails',
  async (offerId, { extra: api }) => {
    const { data } = await api.get<Offer>(`${APIRoute.Offers}/${offerId}`);
    return {
      ...data,
      image: data.previewImage
    };
  }
);

export const fetchNearbyOffers = createAsyncThunk<
  Offer[],
  string,
  { extra: AxiosInstance }
>(
  'offer/fetchNearby',
  async (offerId, { extra: api }) => {
    const { data } = await api.get<Offer[]>(`${APIRoute.Offers}/${offerId}${APIRoute.Nearby}`);
    return data.map((offer) => ({
      ...offer,
      image: offer.previewImage
    }));
  }
);

export const fetchComments = createAsyncThunk<
  Comment[],
  string,
  { extra: AxiosInstance }
>(
  'offer/fetchComments',
  async (offerId, { extra: api }) => {
    const { data } = await api.get<Comment[]>(`${APIRoute.Comments}/${offerId}`);
    return data;
  }
);

export const postComment = createAsyncThunk<
  Comment,
  { offerId: string; comment: NewComment },
  { extra: AxiosInstance }
>(
  'offer/postComment',
  async ({ offerId, comment }, { extra: api }) => {
    const { data } = await api.post<Comment>(`${APIRoute.Comments}/${offerId}`, comment);
    return data;
  }
);

export const toggleFavorite = createAsyncThunk<
  Offer,
  { offerId: string; status: number },
  { extra: AxiosInstance }
>(
  'offers/toggleFavorite',
  async ({ offerId, status }, { extra: api }) => {
    const { data } = await api.post<Offer>(`${APIRoute.Favorite}/${offerId}/${status}`);
    return {
      ...data,
      image: data.previewImage
    };
  }
);

export const fetchFavorites = createAsyncThunk<
  Offer[],
  undefined,
  { extra: AxiosInstance }
>(
  'offers/fetchFavorites',
  async (_arg, { extra: api }) => {
    const { data } = await api.get<Offer[]>(APIRoute.Favorite);
    return data.map((offer) => ({
      ...offer,
      image: offer.previewImage
    }));
  }
);
