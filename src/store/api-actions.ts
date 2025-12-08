import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AxiosInstance } from 'axios';
import { APIRoute } from '../const';
import type { Offer } from '../types/offer';
import type { User, AuthData } from '../types/user';

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
