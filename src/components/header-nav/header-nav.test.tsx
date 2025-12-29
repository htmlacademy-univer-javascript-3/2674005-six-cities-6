import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AuthorizationStatus } from '../../const';
import HeaderNav from './header-nav';

describe('HeaderNav Component', () => {
  const mockUser = {
    name: 'John Doe',
    avatarUrl: 'test-avatar.jpg',
    isPro: false,
    email: 'test@test.com',
    token: 'test-token'
  };

  it('should render sign in link when user is not authorized', () => {
    render(
      <MemoryRouter>
        <HeaderNav
          authorizationStatus={AuthorizationStatus.NoAuth}
          user={null}
          favoriteCount={0}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.queryByText('Sign out')).not.toBeInTheDocument();
  });

  it('should render user info when user is authorized', () => {
    render(
      <MemoryRouter>
        <HeaderNav
          authorizationStatus={AuthorizationStatus.Auth}
          user={mockUser}
          favoriteCount={5}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByAltText('User avatar')).toBeInTheDocument();
  });

  it('should render sign out button when user is authorized and onLogout is provided', () => {
    const handleLogout = vi.fn();

    render(
      <MemoryRouter>
        <HeaderNav
          authorizationStatus={AuthorizationStatus.Auth}
          user={mockUser}
          favoriteCount={3}
          onLogout={handleLogout}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Sign out')).toBeInTheDocument();
  });

  it('should call onLogout when sign out button is clicked', async () => {
    const user = userEvent.setup();
    const handleLogout = vi.fn();

    render(
      <MemoryRouter>
        <HeaderNav
          authorizationStatus={AuthorizationStatus.Auth}
          user={mockUser}
          favoriteCount={3}
          onLogout={handleLogout}
        />
      </MemoryRouter>
    );

    const signOutButton = screen.getByText('Sign out');
    await user.click(signOutButton);

    expect(handleLogout).toHaveBeenCalledTimes(1);
  });

  it('should not render sign out button when user is authorized but onLogout is not provided', () => {
    render(
      <MemoryRouter>
        <HeaderNav
          authorizationStatus={AuthorizationStatus.Auth}
          user={mockUser}
          favoriteCount={3}
        />
      </MemoryRouter>
    );

    expect(screen.queryByText('Sign out')).not.toBeInTheDocument();
  });

  it('should render favorite count correctly', () => {
    render(
      <MemoryRouter>
        <HeaderNav
          authorizationStatus={AuthorizationStatus.Auth}
          user={mockUser}
          favoriteCount={10}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('should render link to favorites page when authorized', () => {
    render(
      <MemoryRouter>
        <HeaderNav
          authorizationStatus={AuthorizationStatus.Auth}
          user={mockUser}
          favoriteCount={0}
        />
      </MemoryRouter>
    );

    const favoritesLink = screen.getByRole('link', { name: /test@test.com/i });
    expect(favoritesLink).toHaveAttribute('href', '/favorites');
  });

  it('should render link to login page when not authorized', () => {
    render(
      <MemoryRouter>
        <HeaderNav
          authorizationStatus={AuthorizationStatus.NoAuth}
          user={null}
          favoriteCount={0}
        />
      </MemoryRouter>
    );

    const loginLink = screen.getByRole('link', { name: /sign in/i });
    expect(loginLink).toHaveAttribute('href', '/login');
  });
});
