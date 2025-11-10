import React from 'react';
import { Navigate } from 'react-router-dom';

type PrivateRouteProps = {
  isAuthorized: boolean;
  children: JSX.Element;
};

function PrivateRoute({ isAuthorized, children }: PrivateRouteProps): JSX.Element {
  if (!isAuthorized) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default PrivateRoute;
