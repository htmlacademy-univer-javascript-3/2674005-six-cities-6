import React, { useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFavorites, logout } from '../../store/api-actions';
import { changeCity } from '../../store/action';
import { selectFavorites, selectFavoritesLoading } from '../../store/selectors/offers-selectors';
import { selectAuthorizationStatus, selectUser } from '../../store/selectors/user-selectors';
import { AuthorizationStatus } from '../../const';
import type { AppDispatch } from '../../store';
import type { Offer } from '../../types/offer';
import OfferCard from '../offer-card/offer-card';
import Spinner from '../spinner/spinner';
import HeaderLogo from '../header-logo/header-logo';

function FavoritesPage(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const favorites = useSelector(selectFavorites);
  const isLoading = useSelector(selectFavoritesLoading);
  const authorizationStatus = useSelector(selectAuthorizationStatus);
  const user = useSelector(selectUser);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  // Group favorites by city
  const favoritesByCity = favorites.reduce<Record<string, Offer[]>>((acc, offer) => {
    const cityName = offer.city.name;
    if (!acc[cityName]) {
      acc[cityName] = [];
    }
    acc[cityName].push(offer);
    return acc;
  }, {});

  const isEmpty = favorites.length === 0;

  return (
    <div className={`page ${isEmpty ? 'page--favorites-empty' : ''}`}>
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <HeaderLogo isActive={false} />
            <nav className="header__nav">
              <ul className="header__nav-list">
                {authorizationStatus === AuthorizationStatus.Auth ? (
                  <>
                    <li className="header__nav-item user">
                      <Link className="header__nav-link header__nav-link--profile" to="/favorites">
                        <div className="header__avatar-wrapper user__avatar-wrapper">
                          {user?.avatarUrl && (
                            <img 
                              src={user.avatarUrl} 
                              alt="User avatar" 
                              style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                            />
                          )}
                        </div>
                        <span className="header__user-name user__name">{user?.email}</span>
                        <span className="header__favorite-count">{favorites.length}</span>
                      </Link>
                    </li>
                    <li className="header__nav-item">
                      <a className="header__nav-link" href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                        <span className="header__signout">Sign out</span>
                      </a>
                    </li>
                  </>
                ) : (
                  <li className="header__nav-item">
                    <Link className="header__nav-link" to="/login">
                      <span className="header__login">Sign in</span>
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className={`page__main page__main--favorites ${isEmpty ? 'page__main--favorites-empty' : ''}`}>
        <div className="page__favorites-container container">
          {isLoading ? (
            <Spinner />
          ) : isEmpty ? (
            <section className="favorites favorites--empty">
              <h1 className="visually-hidden">Favorites (empty)</h1>
              <div className="favorites__status-wrapper">
                <b className="favorites__status">Nothing yet saved.</b>
                <p className="favorites__status-description">
                  Save properties to narrow down search or plan your future trips.
                </p>
              </div>
            </section>
          ) : (
            <section className="favorites">
              <h1 className="favorites__title">Saved listing</h1>
              <ul className="favorites__list">
                {Object.entries(favoritesByCity).map(([cityName, cityOffers]) => (
                  <li key={cityName} className="favorites__locations-items">
                    <div className="favorites__locations locations locations--current">
                      <div className="locations__item">
                        <Link 
                          className="locations__item-link" 
                          to="/"
                          onClick={() => dispatch(changeCity(cityName))}
                          style={{ color: 'white', textDecoration: 'none' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.opacity = '0.7'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.opacity = '1'; }}
                        >
                          <span style={{ color: 'white' }}>{cityName}</span>
                        </Link>
                      </div>
                    </div>
                    <div className="favorites__places" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '18px', maxWidth: '100%' }}>
                      {cityOffers.map((offer) => (
                        <OfferCard key={offer.id} offer={offer} />
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>

      <footer className="footer container">
        <Link className="footer__logo-link" to="/">
          <img
            className="footer__logo"
            src="/img/logo.svg"
            alt="6 cities logo"
            width="64"
            height="33"
          />
        </Link>
      </footer>
    </div>
  );
}

export default FavoritesPage;
