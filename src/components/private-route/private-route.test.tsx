import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { AuthorizationStatus } from '../../const';
import { userSlice } from '../../store/slices/user-slice';
import PrivateRoute from './private-route';

const createMockStore = (authStatus: AuthorizationStatus) =>
  configureStore({
    reducer: {
      user: userSlice.reducer
    },
    preloadedState: {
      user: {
        authorizationStatus: authStatus,
        user: authStatus === AuthorizationStatus.Auth
          ? {
            name: 'Test User',
            avatarUrl: 'test.jpg',
            isPro: false,
            email: 'test@test.com',
            token: 'token'
          }
          : null
      }
    }
  });

describe('PrivateRoute Component', () => {
  it('should render children when user is authorized', () => {
    const store = createMockStore(AuthorizationStatus.Auth);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/private']}>
          <Routes>
            <Route
              path="/private"
              element={
                <PrivateRoute>
                  <div>Private Content</div>
                </PrivateRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Private Content')).toBeInTheDocument();
  });

  it('should redirect to login when user is not authorized', () => {
    const store = createMockStore(AuthorizationStatus.NoAuth);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/private']}>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route
              path="/private"
              element={
                <PrivateRoute>
                  <div>Private Content</div>
                </PrivateRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Private Content')).not.toBeInTheDocument();
  });

  it('should render children when authorization status is unknown', () => {
    const store = createMockStore(AuthorizationStatus.Unknown);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/private']}>
          <Routes>
            <Route
              path="/private"
              element={
                <PrivateRoute>
                  <div>Private Content</div>
                </PrivateRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Private Content')).toBeInTheDocument();
  });
});
