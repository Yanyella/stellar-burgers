import { configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import userReducer from './slices/userSlice';
import ingredientsReducer from './slices/ingredientsSlice';
import ordersReducer from './slices/orderSlice';
import burgerReducer from './slices/burgerSlice';
import feedReducer from './slices/feedSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    ingredients: ingredientsReducer,
    orders: ordersReducer,
    burger: burgerReducer,
    feed: feedReducer
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = dispatchHook;
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
