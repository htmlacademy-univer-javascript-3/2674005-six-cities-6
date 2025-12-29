import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ReviewForm from './review-form';
import { offersSlice } from '../../store/slices/offers-slice';
import { userSlice } from '../../store/slices/user-slice';
import { offerDetailsSlice } from '../../store/slices/offer-details-slice';

// Mock API actions
vi.mock('../../store/api-actions', async () => {
  const actual = await vi.importActual('../../store/api-actions');
  const createMockAsyncThunk = (type: string) => {
    const thunk = Object.assign(
      vi.fn((payload: unknown) => ({
        type,
        payload,
        unwrap: vi.fn(() => Promise.resolve())
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
    postComment: createMockAsyncThunk('comments/postComment')
  };
});

const createMockStore = () =>
  configureStore({
    reducer: {
      offers: offersSlice.reducer,
      user: userSlice.reducer,
      offerDetails: offerDetailsSlice.reducer
    }
  });

describe('ReviewForm Component', () => {
  it('should render form with textarea and rating inputs', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <ReviewForm offerId="1" />
      </Provider>
    );

    expect(screen.getByPlaceholderText(/Tell how was your stay/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(5);
  });

  it('should disable submit button initially', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <ReviewForm offerId="1" />
      </Provider>
    );

    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeDisabled();
  });

  it('should update rating when star is clicked', async () => {
    const user = userEvent.setup();
    const store = createMockStore();

    const { container } = render(
      <Provider store={store}>
        <ReviewForm offerId="1" />
      </Provider>
    );

    const fiveStarLabel = container.querySelector('[title="perfect"]');
    if (fiveStarLabel) {
      await user.click(fiveStarLabel);
    }

    const checkedRadio = screen.getByDisplayValue('5') as HTMLInputElement;
    expect(checkedRadio.checked).toBe(true);
  });

  it('should update comment when typing in textarea', async () => {
    const user = userEvent.setup();
    const store = createMockStore();

    render(
      <Provider store={store}>
        <ReviewForm offerId="1" />
      </Provider>
    );

    const textarea = screen.getByPlaceholderText(/Tell how was your stay/i);
    const testComment = 'This is a test comment with more than fifty characters to pass validation';
    
    await user.type(textarea, testComment);

    expect(textarea).toHaveValue(testComment);
  });

  it('should enable submit button when form is valid', async () => {
    const user = userEvent.setup();
    const store = createMockStore();

    const { container } = render(
      <Provider store={store}>
        <ReviewForm offerId="1" />
      </Provider>
    );

    const textarea = screen.getByPlaceholderText(/Tell how was your stay/i);
    const validComment = 'This is a valid test comment with more than fifty characters to make the form valid';
    
    await user.type(textarea, validComment);
    
    const fiveStarLabel = container.querySelector('[title="perfect"]');
    if (fiveStarLabel) {
      await user.click(fiveStarLabel);
    }

    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).not.toBeDisabled();
  });

  it('should keep submit button disabled when comment is too short', async () => {
    const user = userEvent.setup();
    const store = createMockStore();

    const { container } = render(
      <Provider store={store}>
        <ReviewForm offerId="1" />
      </Provider>
    );

    const textarea = screen.getByPlaceholderText(/Tell how was your stay/i);
    const shortComment = 'Too short';
    
    await user.type(textarea, shortComment);
    
    const fiveStarLabel = container.querySelector('[title="perfect"]');
    if (fiveStarLabel) {
      await user.click(fiveStarLabel);
    }

    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeDisabled();
  });

  it('should keep submit button disabled when rating is not selected', async () => {
    const user = userEvent.setup();
    const store = createMockStore();

    render(
      <Provider store={store}>
        <ReviewForm offerId="1" />
      </Provider>
    );

    const textarea = screen.getByPlaceholderText(/Tell how was your stay/i);
    const validComment = 'This is a valid test comment with more than fifty characters to make the form valid';
    
    await user.type(textarea, validComment);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeDisabled();
  });

  it('should render all rating labels', () => {
    const store = createMockStore();

    const { container } = render(
      <Provider store={store}>
        <ReviewForm offerId="1" />
      </Provider>
    );

    expect(container.querySelector('[title="perfect"]')).toBeInTheDocument();
    expect(container.querySelector('[title="good"]')).toBeInTheDocument();
    expect(container.querySelector('[title="not bad"]')).toBeInTheDocument();
    expect(container.querySelector('[title="badly"]')).toBeInTheDocument();
    expect(container.querySelector('[title="terribly"]')).toBeInTheDocument();
  });

  it('should render help text with requirements', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <ReviewForm offerId="1" />
      </Provider>
    );

    expect(screen.getByText(/To submit review please make sure to set/i)).toBeInTheDocument();
    expect(screen.getByText('50 characters')).toBeInTheDocument();
  });

  it('should have textarea with minLength and maxLength attributes', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <ReviewForm offerId="1" />
      </Provider>
    );

    const textarea = screen.getByPlaceholderText(/Tell how was your stay/i);
    expect(textarea).toHaveAttribute('minLength', '50');
    expect(textarea).toHaveAttribute('maxLength', '300');
  });
});
