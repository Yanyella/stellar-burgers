import userReducer, {
  TUserState,
  initialState,
  getUser,
  registerUser,
  loginUser,
  updateUser,
  logout
} from './userSlice';

describe('тест userSlice', () => {
  it('начальное состояние', () => {
    const state = userReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  it('getUser pending', () => {
    const state = userReducer(initialState, getUser.pending(''));
    expect(state.loading).toBe(true);
  });

  it('getUser fulfilled', () => {
    const user = {
      name: 'Test User',
      email: 'test@example.com'
    };

    const expectedState: TUserState = {
      ...initialState,
      user,
      authentication: true,
      authorize: true,
      loading: false
    };

    const state = userReducer(
      { ...initialState, loading: true },
      getUser.fulfilled(user, '')
    );

    expect(state).toEqual(expectedState);
  });

  it('getUser rejected', () => {
    const expectedState: TUserState = {
      ...initialState,
      authentication: true,
      authorize: false,
      user: null,
      loading: false
    };

    const state = userReducer(
      { ...initialState, loading: true },
      { type: getUser.rejected.type }
    );

    expect(state).toEqual(expectedState);
  });

  it('registerUser pending', () => {
    const state = userReducer(
      initialState,
      registerUser.pending('', {
        name: 'Test',
        email: 'test@test.com',
        password: 'password'
      })
    );
    expect(state.registerUser).toBe(true);
    expect(state.registerError).toBeNull();
  });

  it('registerUser fulfilled', () => {
    const user = {
      name: 'Test User',
      email: 'test@example.com'
    };

    const expectedState: TUserState = {
      ...initialState,
      user,
      authorize: true,
      registerUser: false
    };

    const state = userReducer(
      { ...initialState, registerUser: true },
      registerUser.fulfilled(user, '', {
        name: 'Test',
        email: 'test@test.com',
        password: 'password'
      })
    );

    expect(state).toEqual(expectedState);
  });

  it('registerUser rejected', () => {
    const errorMessage = 'Ошибка регистрации';
    const expectedState: TUserState = {
      ...initialState,
      registerUser: false,
      registerError: errorMessage
    };

    const state = userReducer(
      { ...initialState, registerUser: true },
      {
        type: registerUser.rejected.type,
        payload: errorMessage
      }
    );

    expect(state).toEqual(expectedState);
  });

  it('loginUser pending', () => {
    const state = userReducer(
      initialState,
      loginUser.pending('', { email: 'test@test.com', password: 'password' })
    );
    expect(state.userRequest).toBe(true);
    expect(state.userError).toBeNull();
  });

  it('loginUser fulfilled', () => {
    const user = {
      name: 'Test User',
      email: 'test@example.com'
    };

    const expectedState: TUserState = {
      ...initialState,
      userRequest: false,
      user,
      authorize: true
    };

    const state = userReducer(
      { ...initialState, userRequest: true },
      loginUser.fulfilled(user, '', {
        email: 'test@test.com',
        password: 'password'
      })
    );

    expect(state).toEqual(expectedState);
  });

  it('loginUser rejected', () => {
    const errorMessage = 'Ошибка входа';
    const expectedState: TUserState = {
      ...initialState,
      userRequest: false,
      userError: errorMessage
    };

    const state = userReducer(
      { ...initialState, userRequest: true },
      {
        type: loginUser.rejected.type,
        payload: errorMessage
      }
    );

    expect(state).toEqual(expectedState);
  });

  it('updateUser pending', () => {
    const state = userReducer(
      initialState,
      updateUser.pending('', { name: 'New Name', email: 'new@test.com' })
    );
    expect(state.loading).toBe(true);
  });

  it('updateUser fulfilled', () => {
    const user = {
      name: 'Updated User',
      email: 'updated@example.com'
    };

    const expectedState: TUserState = {
      ...initialState,
      user,
      loading: false
    };

    const state = userReducer(
      { ...initialState, loading: true },
      updateUser.fulfilled(user, '', {
        name: 'New Name',
        email: 'new@test.com'
      })
    );

    expect(state).toEqual(expectedState);
  });

  it('updateUser rejected', () => {
    const expectedState: TUserState = {
      ...initialState,
      loading: false
    };

    const state = userReducer(
      { ...initialState, loading: true },
      { type: updateUser.rejected.type }
    );

    expect(state).toEqual(expectedState);
  });

  it('logout pending', () => {
    const state = userReducer(initialState, logout.pending(''));
    expect(state.loading).toBe(true);
  });

  it('logout fulfilled', () => {
    const expectedState: TUserState = {
      ...initialState,
      loading: false,
      authentication: false,
      user: null,
      authorize: false
    };

    const state = userReducer(
      {
        ...initialState,
        loading: true,
        user: { name: 'Test', email: 'test@test.com' },
        authorize: true
      },
      logout.fulfilled(undefined, '')
    );

    expect(state).toEqual(expectedState);
  });

  it('logout rejected', () => {
    const expectedState: TUserState = {
      ...initialState,
      loading: false,
      authentication: false,
      user: null,
      authorize: false
    };

    const state = userReducer(
      {
        ...initialState,
        loading: true,
        user: { name: 'Test', email: 'test@test.com' },
        authorize: true
      },
      { type: logout.rejected.type }
    );

    expect(state).toEqual(expectedState);
  });
});
