import { useEffect } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { getFeeds } from '../../services/slices/feedSlice';
import { getIngredients } from '../../services/slices/ingredientsSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const { orders, isLoading } = useSelector((state) => state.feed);

  useEffect(() => {
    dispatch(getFeeds());
    dispatch(getIngredients());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(getFeeds());
    dispatch(getIngredients());
  };

  if (isLoading || !orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
