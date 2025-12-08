import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AuthorizationStatus } from '../../const';
import type { RootState } from '../../store';

type PrivateRouteProps = {
  children: JSX.Element;
};

function PrivateRoute({ children }: PrivateRouteProps): JSX.Element {
  const authorizationStatus = useSelector((state: RootState) => state.authorizationStatus);

  if (authorizationStatus === AuthorizationStatus.NoAuth) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default PrivateRoute;
