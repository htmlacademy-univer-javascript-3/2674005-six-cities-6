import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from '../main-page/main-page';
import LoginPage from '../login-page/login-page';
import FavoritesPage from '../favorites-page/favorites-page';
import OfferPage from '../offer-page/offer-page';
import NotFoundPage from '../not-found-page/not-found-page';
import PrivateRoute from '../private-route/private-route';

type AppProps = {
  offersCount: number;
};

function App({ offersCount }: AppProps): JSX.Element {
  const isAuthorized = false;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage offersCount={offersCount} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/favorites"
          element={
            <PrivateRoute isAuthorized={isAuthorized}>
              <FavoritesPage />
            </PrivateRoute>
          }
        />
        <Route path="/offer/:id" element={<OfferPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
