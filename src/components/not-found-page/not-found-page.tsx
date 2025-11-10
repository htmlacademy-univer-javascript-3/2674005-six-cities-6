import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage(): JSX.Element {
  return (
    <div className="page">
      <main className="page__main">
        <h1>404 Not Found</h1>
        <p>Такой страницы нет.</p>
        <Link to="/">На главную</Link>
      </main>
    </div>
  );
}

export default NotFoundPage;
