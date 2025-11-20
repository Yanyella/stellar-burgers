import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { setCookie, getCookie, deleteCookie } from '../../utils/cookie';
import { TUser } from '@utils-types';
import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi
} from '@api';

interface TUserState {
  user: TUser | null; //данные пользователя
  authentication: boolean; //проверка аутентификации
  authorize: boolean; //статус авторизации (вошел/не вошел)
  userRequest: boolean; //вход пользователя
  userError: string | null; //ошибка при входе
  registerUser: boolean; //регистрация
  registerError: string | null; //ошибка при регистрации
  loading: boolean; //загрузка
}
//начальное состояние
const initialState: TUserState = {
  user: null,
  authentication: false,
  authorize: false,
  userRequest: false,
  userError: null,
  registerUser: false,
  registerError: null,
  loading: false
};
//загрузка данных пользователя
export const getUser = createAsyncThunk(
  'user/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      return response.user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка загрузки пользователя');
    }
  }
);
//регистрация нового пользователя
export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (
    {
      name,
      email,
      password
    }: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await registerUserApi({ name, email, password });
      localStorage.setItem('refreshToken', response.refreshToken);
      setCookie('accessToken', response.accessToken);
      return response.user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка регистрации');
    }
  }
);
//вход пользователя
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(data);
      localStorage.setItem('refreshToken', response.refreshToken);
      setCookie('accessToken', response.accessToken);
      return response.user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка входа');
    }
  }
);
//обновление данных пользователя
export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (
    userData: { name: string; email: string; password?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateUserApi(userData);
      return response.user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка обновления');
    }
  }
);
//обновоение данных при выходе пользователя
export const logout = createAsyncThunk(
  'user/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      return;
    } catch (error: any) {
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      return rejectWithValue(error.message || 'Ошибка выхода');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
        state.authentication = true;
        state.authorize = true;
        state.loading = false;
      })
      .addCase(getUser.rejected, (state) => {
        state.authentication = true;
        state.authorize = false;
        state.user = null;
        state.loading = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.registerUser = true;
        state.registerError = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.user = action.payload;
          state.authorize = true;
          state.registerUser = false;
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.registerUser = false;
        state.registerError = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.userRequest = true;
        state.userError = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.userRequest = false;
        state.user = action.payload;
        state.authorize = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.userRequest = false;
        state.userError = action.payload as string;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(updateUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.authentication = false;
        state.user = null;
        state.authorize = false;
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
        state.authentication = false;
        state.user = null;
        state.authorize = false;
      });
  }
});

export default userSlice.reducer;
