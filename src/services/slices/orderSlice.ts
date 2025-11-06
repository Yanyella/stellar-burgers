import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

interface IOrdersState {
  order: TOrder | null;
  orderRequest: boolean;
  orderModal: TOrder | null;
  error: string | null;
}

const initialState: IOrdersState = {
  order: null,
  orderRequest: false,
  orderModal: null,
  error: null
};

// Создание нового заказа
export const createOrder = createAsyncThunk(
  'orders/createOrder',
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
  'orders/fetchOrderByNumber',
  async (number: number, thunkAPI) => {
    try {
      const response = await getOrderByNumberApi(number);
      return response.orders[0];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrder(state) {
      state.order = null;
      state.orderRequest = false;
      state.error = null;
    },
    setOrderModal: (state, action) => {
      state.orderModal = action.payload;
    },
    clearOrderModal(state) {
      state.orderModal = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.orderRequest = false;
          state.order = action.payload;
          state.orderModal = action.payload;
        }
      )
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message as string;
      })

      .addCase(fetchOrderByNumber.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(
        fetchOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.orderRequest = false;
          state.orderModal = action.payload;
        }
      )
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message as string;
      });
  }
});

export const { clearOrder, clearOrderModal } = ordersSlice.actions;
export default ordersSlice.reducer;
