import React from 'react';
import OfferCard from '../offer-card/offer-card';
import type { Offer } from '../../types/offer';

type OffersListProps = {
  offers: Offer[];
  onOfferHover?: (id: string | null) => void;
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
