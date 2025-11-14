import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { setCookie, getCookie } from '../../utils/cookie';
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

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    //статус проверки аутентификации
    setAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.authentication = action.payload;
    },
    //очистка ошибок
    clearUserErrors: (state) => {
      state.userError = null;
      state.registerError = null;
    },
    //установка пользователя
    setUser: (state, action: PayloadAction<TUser | null>) => {
      state.user = action.payload;
    },
    //установка статуса аутентификации
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.authentication = action.payload;
    },
    //выход пользователя
    logoutUser: (state) => {
      state.user = null;
      state.authentication = false;
      state.authorize = true;
      localStorage.removeItem('refreshToken');
      document.cookie = 'accessToken=; Max-Age=0';
    }
  },
  extraReducers: (builder) => {
    builder //обработка данных пользователя
      .addCase(getUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
        state.authentication = true;
        state.authorize = true;
        state.loading = false;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.authentication = true;
        state.authorize = false;
        state.user = null;
        state.loading = false;
      }) //обработка регистрации
      .addCase(registerUser.pending, (state) => {
        state.registerUser = true;
        state.registerError = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.user = action.payload;
          state.authentication = true;
          state.authorize = true;
          state.registerUser = false;
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.registerUser = false;
        state.registerError = action.payload as string;
      }) //обработка входа
      .addCase(loginUser.pending, (state) => {
        state.userRequest = true;
        state.userError = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.userRequest = false;
        state.user = action.payload;
        state.authentication = true;
        state.authorize = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.userRequest = false;
        state.userError = action.payload as string;
      }) //обработка обновления данных пользователя
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
      });
  }
});

export const {
  setAuthChecked,
  clearUserErrors,
  setUser,
  setAuthenticated,
  logoutUser
} = userSlice.actions;

export default userSlice.reducer;
