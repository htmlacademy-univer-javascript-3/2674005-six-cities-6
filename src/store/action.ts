import { createAction } from '@reduxjs/toolkit';
import { AuthorizationStatus } from '../const';

export const changeCity = createAction<string>('city/change');
export const requireAuthorization = createAction<AuthorizationStatus>('user/requireAuthorization');
