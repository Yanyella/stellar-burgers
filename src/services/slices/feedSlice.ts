import { TOrder } from '@utils-types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi, getOrdersApi } from '@api';

interface IFeedState {
  orders: TOrder[]; //заказы
  total: number; //количество заказов
  totalToday: number; //количество заказов сегодня
  error: string | null; //ошибка
  isLoading: boolean; //загрузка
  userOrders: TOrder[] | null; //заказы пользователя
  userOrdersLoading: boolean; //загрузка заказов пользователя
  userOrdersError: string | null; //ошибка загрузки заказов пользователя
}

//начальное состояние
const initialState: IFeedState = {
  orders: [], //заказы
  total: 0, //количество заказов
  totalToday: 0, //количество заказов сегодня
  error: null, //ошибка
  isLoading: true, //загрузка
  userOrders: [], //заказы пользователя
  userOrdersLoading: true, //загрузка заказов пользователя
  userOrdersError: null //ошибка загрузки заказов пользователя
};

//запрос к серверу лента
export const getFeeds = createAsyncThunk(
  'feed/getFeeds',
  async (_, thunkAPI) => {
    try {
      const response = await getFeedsApi();
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

//запрос к серверу с заказами пользователя
export const getOrders = createAsyncThunk(
  'feed/getOrders',
  async (_, thunkAPI) => {
    try {
      const response = await getOrdersApi();
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //лента заказов
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      //заказы пользователя
      .addCase(getOrders.pending, (state) => {
        state.userOrdersLoading = true;
        state.userOrdersError = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.userOrders = action.payload;
        state.userOrdersLoading = false;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.userOrdersLoading = false;
        state.error = action.payload as string;
      });
  }
});

export default feedSlice.reducer;
