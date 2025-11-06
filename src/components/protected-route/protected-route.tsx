import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { FC, ReactElement } from 'react';
import { Preloader } from '@ui';

type TProps = {
  onlyUnAuth?: boolean;
  children: ReactElement;
};

export const ProtectedRoute: FC<TProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const location = useLocation();
  const user = useSelector((state) => state.user.user);
  const isAuthChecked = useSelector((state) => state.user.isAuthChecked);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  return children;
};
