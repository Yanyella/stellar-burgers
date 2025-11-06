import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { getOrders } from '../../services/slices/feedSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { userOrders, userOrdersLoading } = useSelector((state) => state.feed);

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  if (userOrdersLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={userOrders || []} />;
};
