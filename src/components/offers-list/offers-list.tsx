import React from 'react';
import OfferCard from '../offer-card/offer-card';
import type { Offer } from '../../mocks/offers';

type OffersListProps = {
  offers: Offer[];
  onOfferHover?: (id: number | null) => void;
};

function OffersList({ offers, onOfferHover }: OffersListProps): JSX.Element {
  return (
    <>
      {offers.map((offer) => (
        <OfferCard
          key={offer.id}
          offer={offer}
          onMouseEnter={onOfferHover ? () => onOfferHover(offer.id) : undefined}
          onMouseLeave={onOfferHover ? () => onOfferHover(null) : undefined}
        />
      ))}
    </>
  );
}

export default OffersList;
