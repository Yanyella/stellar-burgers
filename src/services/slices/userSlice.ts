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

type TUserState = {
  user: TUser | null;
  isAuthenticated: boolean;
  isAuthChecked: boolean;
  loginUserRequest: boolean;
  loginUserError: string | null;
  registerUserRequest: boolean;
  registerUserError: string | null;
  isLoading: boolean;
};

const initialState: TUserState = {
  user: null,
  isAuthenticated: false,
  isAuthChecked: false,
  loginUserRequest: false,
  loginUserError: null,
  registerUserRequest: false,
  registerUserError: null,
  isLoading: false
};

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
    setAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
    clearUserErrors: (state) => {
      state.loginUserError = null;
      state.registerUserError = null;
    },
    setUser: (state, action: PayloadAction<TUser | null>) => {
      state.user = action.payload;
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isAuthChecked = true;
      localStorage.removeItem('refreshToken');
      document.cookie = 'accessToken=; Max-Age=0';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(registerUser.pending, (state) => {
        state.registerUserRequest = true;
        state.registerUserError = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.registerUserRequest = false;
          state.user = action.payload;
          state.isAuthenticated = true;
          state.isAuthChecked = true;
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.registerUserRequest = false;
        state.registerUserError =
          (action.payload as string) || 'Ошибка регистрации';
      })
      .addCase(loginUser.pending, (state) => {
        state.loginUserRequest = true;
        state.loginUserError = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.loginUserRequest = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.loginUserError = (action.payload as string) || 'Ошибка входа';
      })
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
