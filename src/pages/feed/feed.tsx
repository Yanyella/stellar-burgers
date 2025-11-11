import { useEffect } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { getFeeds } from '../../services/slices/feedSlice';
import { getIngredients } from '../../services/slices/ingredientsSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector((state) => state.feed);
  useEffect(() => {
    dispatch(getFeeds());
    dispatch(getIngredients());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  const handleGetFeeds = () => {
    dispatch(getFeeds());
    dispatch(getIngredients());
  };

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
