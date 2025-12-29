import React, { useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import OffersList from '../offers-list/offers-list';
import Map from '../map/map';
import CitiesList from '../cities-list/cities-list';
import Sorting, { SortType } from '../sorting/sorting';
import Spinner from '../spinner/spinner';
import HeaderLogo from '../header-logo/header-logo';
import HeaderNav from '../header-nav/header-nav';
import MainEmpty from '../main-empty/main-empty';
import { changeCity } from '../../store/action';
import { logout } from '../../store/api-actions';
import { selectCity, selectCityOffers, selectOffersLoading, selectFavoriteOffers } from '../../store/selectors/offers-selectors';
import { selectAuthorizationStatus, selectUser } from '../../store/selectors/user-selectors';
import type { AppDispatch } from '../../store';

function MainPage(): JSX.Element {
  const [activeOfferId, setActiveOfferId] = useState<string | null>(null);
  const [currentSort, setCurrentSort] = useState<SortType>(SortType.Popular);
  const dispatch = useDispatch<AppDispatch>();
  
  const currentCity = useSelector(selectCity);
  const cityOffers = useSelector(selectCityOffers);
  const isLoading = useSelector(selectOffersLoading);
  const authorizationStatus = useSelector(selectAuthorizationStatus);
  const user = useSelector(selectUser);
  const favoriteOffers = useSelector(selectFavoriteOffers);

  const sortedOffers = useMemo(() => {
    const offers = [...cityOffers];
    
    switch (currentSort) {
      case SortType.PriceLowToHigh:
        return offers.sort((a, b) => a.price - b.price);
      case SortType.PriceHighToLow:
        return offers.sort((a, b) => b.price - a.price);
      case SortType.TopRatedFirst:
        return offers.sort((a, b) => b.rating - a.rating);
      case SortType.Popular:
      default:
        return offers;
    }
  }, [cityOffers, currentSort]);

  const handleCityChange = useCallback((city: string) => {
    dispatch(changeCity(city));
    setCurrentSort(SortType.Popular);
  }, [dispatch]);

  const handleSortChange = useCallback((sort: SortType) => {
    setCurrentSort(sort);
  }, []);

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return (
    <div className="page page--gray page--main">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <HeaderLogo isActive />
            <HeaderNav 
              authorizationStatus={authorizationStatus}
              user={user}
              favoriteCount={favoriteOffers.length}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </header>

      <main className={`page__main page__main--index ${cityOffers.length === 0 && !isLoading ? 'page__main--index-empty' : ''}`}>
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
          <CitiesList currentCity={currentCity} onCityChange={handleCityChange} />
        </div>

        <div className="cities">
          {isLoading ? (
            <Spinner />
          ) : cityOffers.length === 0 ? (
            <div className="cities__places-container cities__places-container--empty container">
              <MainEmpty city={currentCity} />
              <div className="cities__right-section"></div>
            </div>
          ) : (
            <div className="cities__places-container container">
              <section className="cities__places places">
                <h2 className="visually-hidden">Places</h2>
                <b className="places__found">
                  {cityOffers.length} places to stay in {currentCity}
                </b>

                <Sorting currentSort={currentSort} onSortChange={handleSortChange} />

                <div className="cities__places-list places__list tabs__content">
                  <OffersList offers={sortedOffers} onOfferHover={setActiveOfferId} />
                </div>
              </section>

              <div className="cities__right-section">
                <Map offers={sortedOffers} activeOfferId={activeOfferId} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default MainPage;
