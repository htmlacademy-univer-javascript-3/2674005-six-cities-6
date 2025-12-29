import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { AuthorizationStatus } from '../../const';
import { userSlice } from '../../store/slices/user-slice';
import { offersSlice } from '../../store/slices/offers-slice';
import { offerDetailsSlice } from '../../store/slices/offer-details-slice';
import LoginPage from './login-page';

// Mock login action
const mockLogin = vi.fn();
vi.mock('../../store/api-actions', async () => {
  const actual = await vi.importActual('../../store/api-actions');
  const createMockAsyncThunk = (type: string, handler?: (payload: { email: string; password: string }) => { type: string; payload: { email: string; password: string } }) => {
    const thunk = Object.assign(
      handler || vi.fn((payload: { email: string; password: string }) => ({
        type,
        payload
      })),
      {
        pending: { type: `${type}/pending`, toString: () => `${type}/pending` },
        fulfilled: { type: `${type}/fulfilled`, toString: () => `${type}/fulfilled` },
        rejected: { type: `${type}/rejected`, toString: () => `${type}/rejected` }
      }
    );
    return thunk;
  };
  
  return {
    ...actual,
    login: createMockAsyncThunk('user/login', (credentials: { email: string; password: string }) => {
      mockLogin(credentials);
      return {
        type: 'user/login',
        payload: credentials
      };
    })
  };
});

const createMockStore = (authStatus: AuthorizationStatus) =>
  configureStore({
    reducer: combineReducers({
      user: userSlice.reducer,
      offers: offersSlice.reducer,
      offerDetails: offerDetailsSlice.reducer
    }),
    preloadedState: {
      user: {
        authorizationStatus: authStatus,
        user: null
      },
      offers: {
        city: 'Paris',
        offers: [],
        favorites: [],
        isLoading: false,
        isFavoritesLoading: false,
        hasError: false
      },
      offerDetails: {
        currentOffer: null,
        nearbyOffers: [],
        comments: [],
        isOfferLoading: false,
        isCommentsLoading: false,
        hasOfferError: false
      }
    }
  });

describe('LoginPage Component', () => {
  it('should render login form', () => {
    const store = createMockStore(AuthorizationStatus.NoAuth);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should update email input value', async () => {
    const user = userEvent.setup();
    const store = createMockStore(AuthorizationStatus.NoAuth);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    const emailInput = screen.getByPlaceholderText(/email/i);
    await user.type(emailInput, 'test@test.com');

    expect(emailInput).toHaveValue('test@test.com');
  });

  it('should update password input value', async () => {
    const user = userEvent.setup();
    const store = createMockStore(AuthorizationStatus.NoAuth);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    const passwordInput = screen.getByPlaceholderText(/password/i);
    await user.type(passwordInput, 'password123');

    expect(passwordInput).toHaveValue('password123');
  });

  it('should show error when submitting empty form', async () => {
    const store = createMockStore(AuthorizationStatus.NoAuth);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    const form = screen.getByRole('button', { name: /sign in/i }).closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument();
  });

  it('should show error when password is only spaces', async () => {
    const user = userEvent.setup();
    const store = createMockStore(AuthorizationStatus.NoAuth);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@test.com');
    await user.type(passwordInput, '   ');
    await user.click(submitButton);

    expect(screen.getByText(/password cannot consist only of spaces/i)).toBeInTheDocument();
  });

  it('should call login action with correct credentials', async () => {
    const user = userEvent.setup();
    const store = createMockStore(AuthorizationStatus.NoAuth);
    mockLogin.mockClear();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@test.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'password123'
    });
  });

  it('should render logo link', () => {
    const store = createMockStore(AuthorizationStatus.NoAuth);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    const logo = screen.getByAltText('6 cities logo');
    expect(logo).toBeInTheDocument();
  });
});
