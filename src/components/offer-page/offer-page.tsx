import React from 'react';
import { useParams } from 'react-router-dom';

function OfferPage(): JSX.Element {
  const { id } = useParams();

  return (
    <div className="page">
      <main className="page__main">
        <h1>Страница предложения {id}</h1>
      </main>
    </div>
  );
}

export default OfferPage;
