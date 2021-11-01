import React from 'react';
import { useSelector } from 'react-redux';
import { Route } from 'react-router-dom';
import { LinearProgress } from '@material-ui/core';

import ForbiddenPage from '../../pages/Errors/ForbiddenPageError.jsx';

const PrivateRoute = ({ component: Component, ...routeProps }) => {
  const { isAuth, isLoading } = useSelector(({ user }) => user);

  return isLoading ? (
    <LinearProgress />
  ) : (
    <Route
      {...routeProps}
      render={(props) => (isAuth ? <Component {...props} /> : <ForbiddenPage />)}
    />
  );
};

export default PrivateRoute;
