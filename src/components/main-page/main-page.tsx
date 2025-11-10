import React, { useState } from 'react';
import OffersList from '../offers-list/offers-list';
import type { Offer } from '../../mocks/offers';

type MainPageProps = {
  offers: Offer[];
};

function MainPage({ offers }: MainPageProps): JSX.Element {
  const [activeOfferId, setActiveOfferId] = useState<number | null>(null);

  return (
    <div className="page page--gray page--main">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <a className="header__logo-link" href="/">
                <img
                  className="header__logo"
                  src="img/logo.svg"
                  alt="Логотип шести городов"
                  width="81"
                  height="41"
                />
              </a>
            </div>
            <nav className="header__nav"></nav>
          </div>
        </div>
      </header>

      <main className="page__main page__main--main">
        <h1 className="visually-hidden">Города</h1>

        <div className="tabs"></div>

        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places">
              <h2 className="visually-hidden">Места</h2>

              <b className="places__found">
                {offers.length} предложений для аренды в Амстердаме
              </b>

              <form className="places__sorting" action="#" method="get"></form>

              <div className="cities__places-list places__list tabs__content">
                <OffersList offers={offers} onOfferHover={setActiveOfferId} />
              </div>
            </section>

            <div className="cities__right-section">
              <section className="cities__map map">
                {activeOfferId}
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MainPage;
