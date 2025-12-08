import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import OffersList from '../offers-list/offers-list';
import Map from '../map/map';
import CitiesList from '../cities-list/cities-list';
import type { RootState } from '../../store';
import { changeCity } from '../../store/action';

function MainPage(): JSX.Element {
  const [activeOfferId, setActiveOfferId] = useState<number | null>(null);
  const dispatch = useDispatch();
  const currentCity = useSelector((state: RootState) => state.city);
  const allOffers = useSelector((state: RootState) => state.offers);

  const cityOffers = useMemo(
    () => allOffers.filter((offer) => offer.city.name === currentCity),
    [allOffers, currentCity]
  );

  const handleCityChange = (city: string) => {
    dispatch(changeCity(city));
  };

  return (
    <div className="page page--gray page--main">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <a className="header__logo-link header__logo-link--active" href="/">
                <img
                  className="header__logo"
                  src="/img/logo.svg"
                  alt="6 cities logo"
                  width="81"
                  height="41"
                />
              </a>
            </div>
            <nav className="header__nav">
              <ul className="header__nav-list">
                <li className="header__nav-item user">
                  <a className="header__nav-link header__nav-link--profile" href="#">
                    <div className="header__avatar-wrapper user__avatar-wrapper"></div>
                    <span className="header__user-name user__name">Oliver.conner@gmail.com</span>
                    <span className="header__favorite-count">3</span>
                  </a>
                </li>
                <li className="header__nav-item">
                  <a className="header__nav-link" href="#">
                    <span className="header__signout">Sign out</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
          <CitiesList currentCity={currentCity} onCityChange={handleCityChange} />
        </div>

        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places">
              <h2 className="visually-hidden">Places</h2>
              <b className="places__found">
                {cityOffers.length} places to stay in {currentCity}
              </b>

              <form className="places__sorting" action="#" method="get">
                <span className="places__sorting-caption">Sort by</span>
                <span className="places__sorting-type" tabIndex={0}>
                  Popular
                  <svg className="places__sorting-arrow" width="7" height="4">
                    <use xlinkHref="#icon-arrow-select"></use>
                  </svg>
                </span>
              </form>

              <div className="cities__places-list places__list tabs__content">
                <OffersList offers={cityOffers} onOfferHover={setActiveOfferId} />
              </div>
            </section>

            <div className="cities__right-section">
              <Map offers={cityOffers} activeOfferId={activeOfferId} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MainPage;
