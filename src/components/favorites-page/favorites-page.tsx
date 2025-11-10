import React from 'react';
import type { Offer } from '../../mocks/offers';
import OfferCard from '../offer-card/offer-card';

type FavoritesPageProps = {
  offers: Offer[];
};

function FavoritesPage({ offers }: FavoritesPageProps): JSX.Element {
  return (
    <div className="page">
      <main className="page__main">
        <h1>Избранное</h1>
        <div className="cities__places-list places__list">
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default FavoritesPage;
