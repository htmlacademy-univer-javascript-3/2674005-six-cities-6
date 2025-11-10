import React from 'react';
import { useParams } from 'react-router-dom';
import type { Offer } from '../../mocks/offers';
import NotFoundPage from '../not-found-page/not-found-page';
import ReviewForm from '../review-form/review-form';

type OfferPageProps = {
  offers: Offer[];
};

function OfferPage({ offers }: OfferPageProps): JSX.Element {
  const params = useParams();
  const id = Number(params.id);
  const offer = offers.find((item) => item.id === id);

  if (!offer) {
    return <NotFoundPage />;
  }

  return (
    <div className="page">
      <main className="page__main">
        <section className="offer">
          <h1>{offer.title}</h1>
          <img src={offer.image} alt={offer.title} width="320" />
          <p>Город: {offer.city}</p>
          <p>Тип: {offer.type}</p>
          <p>Цена: €{offer.price} за ночь</p>
          <p>Рейтинг: {offer.rating}</p>
        </section>

        <section className="reviews">
          <h2>Оставить комментарий</h2>
          <ReviewForm />
        </section>
      </main>
    </div>
  );
}

export default OfferPage;
