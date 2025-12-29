import React, { useEffect, useCallback } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOfferDetails, fetchNearbyOffers, fetchComments, logout, toggleFavorite } from '../../store/api-actions';
import { clearCurrentOffer } from '../../store/action';
import { AuthorizationStatus } from '../../const';
import type { AppDispatch } from '../../store';
import ReviewForm from '../review-form/review-form';
import Spinner from '../spinner/spinner';
import { selectCurrentOffer, selectComments, selectOfferLoading, selectOfferError } from '../../store/selectors/offer-details-selectors';
import { selectAuthorizationStatus, selectUser } from '../../store/selectors/user-selectors';
import { selectFavoriteOffers } from '../../store/selectors/offers-selectors';

function OfferPage(): JSX.Element {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const offer = useSelector(selectCurrentOffer);
  const comments = useSelector(selectComments);
  const isOfferLoading = useSelector(selectOfferLoading);
  const hasOfferError = useSelector(selectOfferError);
  const authorizationStatus = useSelector(selectAuthorizationStatus);
  const user = useSelector(selectUser);
  const favoriteOffers = useSelector(selectFavoriteOffers);

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const handleFavoriteClick = useCallback(() => {
    if (authorizationStatus !== AuthorizationStatus.Auth) {
      navigate('/login');
      return;
    }

    if (offer) {
      dispatch(toggleFavorite({
        offerId: offer.id,
        status: offer.isFavorite ? 0 : 1
      }));
    }
  }, [authorizationStatus, navigate, offer, dispatch]);

  useEffect(() => {
    if (id) {
      if (offer?.id !== id) {
        dispatch(clearCurrentOffer());
      }
      dispatch(fetchOfferDetails(id));
      dispatch(fetchNearbyOffers(id));
      dispatch(fetchComments(id));
    }
  }, [dispatch, id, offer?.id]);

  if (hasOfferError) {
    return <Navigate to="/404" />;
  }

  if (isOfferLoading || !offer) {
    return <Spinner />;
  }

  return (
    <div className="page">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <Link className="header__logo-link" to="/">
                <img
                  className="header__logo"
                  src="/img/logo.svg"
                  alt="6 cities logo"
                  width="81"
                  height="41"
                />
              </Link>
            </div>

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
                        <span className="header__favorite-count">{favoriteOffers.length}</span>
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

      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              {offer.images?.slice(0, 6).map((imageUrl, index) => (
                <div key={imageUrl + index} className="offer__image-wrapper">
                  <img
                    className="offer__image"
                    src={imageUrl}
                    alt={offer.title}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="offer__container container">
            <div className="offer__wrapper">
              {offer.isPremium && (
                <div className="offer__mark">
                  <span>Premium</span>
                </div>
              )}

              <div className="offer__name-wrapper">
                <h1 className="offer__name">{offer.title}</h1>
                <button
                  className={`offer__bookmark-button ${offer.isFavorite ? 'offer__bookmark-button--active' : ''} button`}
                  type="button"
                  onClick={handleFavoriteClick}
                >
                  <svg className="offer__bookmark-icon" width="31" height="33">
                    <use xlinkHref="#icon-bookmark"></use>
                  </svg>
                  <span className="visually-hidden">
                    {offer.isFavorite ? 'In bookmarks' : 'To bookmarks'}
                  </span>
                </button>
              </div>

              <div className="offer__rating rating">
                <div className="offer__stars rating__stars" style={{ position: 'relative', width: '73px', height: '12px' }}>
                  <img src="/img/stars.svg" alt="rating" style={{ position: 'absolute', top: 0, left: 0, width: '73px', height: '12px' }} />
                  <img src="/img/stars-active.svg" alt="active rating" style={{ position: 'absolute', top: 0, left: 0, width: '73px', height: '12px', clipPath: `inset(0 ${100 - offer.rating * 20}% 0 0)` }} />
                </div>
                <span className="visually-hidden">Rating</span>
                <span className="offer__rating-value rating__value">
                  {offer.rating.toFixed(1)}
                </span>
              </div>

              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">
                  {offer.type}
                </li>
                {offer.bedrooms && (
                  <li className="offer__feature offer__feature--bedrooms">
                    {offer.bedrooms} Bedrooms
                  </li>
                )}
                {offer.maxAdults && (
                  <li className="offer__feature offer__feature--adults">
                    Max {offer.maxAdults} adults
                  </li>
                )}
              </ul>

              <div className="offer__price">
                <b className="offer__price-value">€{offer.price}</b>
                <span className="offer__price-text">&nbsp;night</span>
              </div>

              {offer.goods && offer.goods.length > 0 && (
                <div className="offer__inside">
                  <h2 className="offer__inside-title">What&apos;s inside</h2>
                  <ul className="offer__inside-list">
                    {offer.goods.map((good) => (
                      <li key={good} className="offer__inside-item">
                        {good}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="offer__host">
                <h2 className="offer__host-title">Meet the host</h2>
                <div className="offer__host-user user">
                  <div className={`offer__avatar-wrapper ${offer.host?.isPro ? 'offer__avatar-wrapper--pro' : ''} user__avatar-wrapper`}>
                    <img
                      className="offer__avatar user__avatar"
                      src={offer.host?.avatarUrl || '/img/avatar-angelina.jpg'}
                      width="74"
                      height="74"
                      alt="Host avatar"
                    />
                  </div>
                  <span className="offer__user-name">{offer.host?.name || 'Host'}</span>
                  {offer.host?.isPro && <span className="offer__user-status">Pro</span>}
                </div>
                {offer.description && (
                  <div className="offer__description">
                    <p className="offer__text">{offer.description}</p>
                  </div>
                )}
              </div>

              <section className="offer__reviews reviews">
                <h2 className="reviews__title">
                  Reviews · <span className="reviews__amount">{comments.length}</span>
                </h2>
                <ul className="reviews__list">
                  {comments.map((comment) => (
                    <li key={comment.id} className="reviews__item">
                      <div className="reviews__user user">
                        <div className="reviews__avatar-wrapper user__avatar-wrapper">
                          <img
                            className="reviews__avatar user__avatar"
                            src={comment.user.avatarUrl}
                            width="54"
                            height="54"
                            alt="Reviews avatar"
                          />
                        </div>
                        <span className="reviews__user-name">{comment.user.name}</span>
                      </div>
                      <div className="reviews__info">
                        <div className="reviews__rating rating">
                          <div className="reviews__stars rating__stars" style={{ position: 'relative', width: '73px', height: '12px' }}>
                            <img src="/img/stars.svg" alt="rating" style={{ position: 'absolute', top: 0, left: 0, width: '73px', height: '12px' }} />
                            <img src="/img/stars-active.svg" alt="active rating" style={{ position: 'absolute', top: 0, left: 0, width: '73px', height: '12px', clipPath: `inset(0 ${100 - comment.rating * 20}% 0 0)` }} />
                          </div>
                          <span className="visually-hidden">Rating</span>
                        </div>
                        <p className="reviews__text">{comment.comment}</p>
                        <time className="reviews__time" dateTime={comment.date}>
                          {new Date(comment.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                        </time>
                      </div>
                    </li>
                  ))}
                </ul>
                {authorizationStatus === AuthorizationStatus.Auth && <ReviewForm offerId={id!} />}
              </section>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default OfferPage;