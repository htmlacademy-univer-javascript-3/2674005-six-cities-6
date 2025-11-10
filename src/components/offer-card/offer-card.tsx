import React from 'react';

function OfferCard(): JSX.Element {
  return (
    <article className="cities__card place-card">
      <div className="place-card__image-wrapper cities__image-wrapper">
        <a href="#">
          <img
            className="place-card__image"
            src="img/apartment-01.jpg"
            width="260"
            height="200"
            alt="Жилье"
          />
        </a>
      </div>
      <div className="place-card__info">
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">€120</b>
            <span className="place-card__price-text">&#47;&nbsp;ночь</span>
          </div>
          <button className="place-card__bookmark-button button" type="button">
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use xlinkHref="#icon-bookmark" />
            </svg>
            <span className="visually-hidden">В закладки</span>
          </button>
        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{ width: '80%' }} />
            <span className="visually-hidden">Рейтинг</span>
          </div>
        </div>
        <h2 className="place-card__name">
          <a href="#">
            Красивые и уютные апартаменты в отличном районе
          </a>
        </h2>
        <p className="place-card__type">Апартаменты</p>
      </div>
    </article>
  );
}

export default OfferCard;
