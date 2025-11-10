import React, { useState, ChangeEvent, FormEvent } from 'react';

type ReviewFormProps = {
  onSubmit?: (data: { rating: number; comment: string }) => void;
};

function ReviewForm({ onSubmit }: ReviewFormProps): JSX.Element {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  function handleRatingChange(evt: ChangeEvent<HTMLInputElement>) {
    setRating(Number(evt.target.value));
  }

  function handleCommentChange(evt: ChangeEvent<HTMLTextAreaElement>) {
    setComment(evt.target.value);
  }

  function handleSubmit(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    if (onSubmit) {
      onSubmit({ rating, comment });
    }
  }

  return (
    <form className="reviews__form form" onSubmit={handleSubmit}>
      <label className="reviews__label form__label" htmlFor="review">
        Ваш отзыв
      </label>
      <div className="reviews__rating-form form__rating">
        <input
          className="form__rating-input visually-hidden"
          name="rating"
          value="5"
          id="5-stars"
          type="radio"
          checked={rating === 5}
          onChange={handleRatingChange}
        />
        <label className="reviews__rating-label form__rating-label" htmlFor="5-stars" title="perfect">
          <span className="visually-hidden">5 stars</span>
        </label>

        <input
          className="form__rating-input visually-hidden"
          name="rating"
          value="4"
          id="4-stars"
          type="radio"
          checked={rating === 4}
          onChange={handleRatingChange}
        />
        <label className="reviews__rating-label form__rating-label" htmlFor="4-stars" title="good">
          <span className="visually-hidden">4 stars</span>
        </label>

        <input
          className="form__rating-input visually-hidden"
          name="rating"
          value="3"
          id="3-stars"
          type="radio"
          checked={rating === 3}
          onChange={handleRatingChange}
        />
        <label className="reviews__rating-label form__rating-label" htmlFor="3-stars" title="not bad">
          <span className="visually-hidden">3 stars</span>
        </label>

        <input
          className="form__rating-input visually-hidden"
          name="rating"
          value="2"
          id="2-stars"
          type="radio"
          checked={rating === 2}
          onChange={handleRatingChange}
        />
        <label className="reviews__rating-label form__rating-label" htmlFor="2-stars" title="badly">
          <span className="visually-hidden">2 stars</span>
        </label>

        <input
          className="form__rating-input visually-hidden"
          name="rating"
          value="1"
          id="1-star"
          type="radio"
          checked={rating === 1}
          onChange={handleRatingChange}
        />
        <label className="reviews__rating-label form__rating-label" htmlFor="1-star" title="terribly">
          <span className="visually-hidden">1 star</span>
        </label>
      </div>

      <textarea
        className="reviews__textarea form__textarea"
        id="review"
        name="review"
        placeholder="Расскажите, как прошла ваша поездка"
        value={comment}
        onChange={handleCommentChange}
      />

      <div className="reviews__button-wrapper">
        <button className="reviews__submit form__submit button" type="submit">
          Отправить
        </button>
      </div>
    </form>
  );
}

export default ReviewForm;
