import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi, getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

interface IOrdersState {
  orders: TOrder[]; //все заказы
  orderLoading: boolean; //загрузка конкретного заказа
  orderModal: TOrder | null; //модальное окно заказа
  orderRequest: boolean; //статус запроса на создание заказа
  loading: boolean; // загрузка всех заказов
  error: string | null; //ошибки
}

//начальное состояние
const initialState: IOrdersState = {
  orders: [], //все заказы
  orderLoading: false, //загрузка конкретного заказа
  orderModal: null, //модальное окно заказа
  orderRequest: false, //статус запроса на создание заказа
  loading: false, // загрузка всех заказов
  error: null //ошибки
};

//получение списка заказов
export const getOrders = createAsyncThunk(
  'order/getOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getOrdersApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Создание нового заказа
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredientIds: string[], thunkAPI) => {
    try {
      const response = await orderBurgerApi(ingredientIds);
      return response.order;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Получение заказа по номеру
export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchOrderByNumber',
  async (number: number, thunkAPI) => {
    try {
      const response = await getOrderByNumberApi(number);
      return response.orders[0];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderModal = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder //обработка списка заказов
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      }) //обработка заказа по номеру
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.orderLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.orderLoading = false;
        state.orderModal = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.orderLoading = false;
        state.error = action.payload as string;
      }) //обработка созданного заказа
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderModal = action.payload;
        state.orderRequest = false;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.payload as string;
      });
  }
});
export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
