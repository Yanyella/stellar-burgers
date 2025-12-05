import ordersReducer, {
  IOrdersState,
  initialState,
  getOrders,
  createOrder,
  fetchOrderByNumber
} from './orderSlice';

describe('тест orderSlice', () => {
  it('начальное состояние', () => {
    const state = ordersReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  it('getOrders pending', () => {
    const state = ordersReducer(initialState, getOrders.pending(''));
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('getOrders fulfilled', () => {
    const orders = [
      {
        _id: '69202192a64177001b31fdb0',
        name: 'Флюоресцентный люминесцентный бургер',
        status: 'done',
        createdAt: '2025-11-21T08:23:46.399Z',
        updatedAt: '2025-11-21T08:23:46.588Z',
        number: 94917,
        ingredients: [
          '643d69a5c3f7b9001cfa093d',
          '643d69a5c3f7b9001cfa093e',
          '643d69a5c3f7b9001cfa093e',
          '643d69a5c3f7b9001cfa093d'
        ]
      }
    ];

    const expectedState: IOrdersState = {
      ...initialState,
      orders,
      loading: false
    };

    const actualState = ordersReducer(
      {
        ...initialState,
        loading: true
      },
      getOrders.fulfilled(orders, '', undefined)
    );

    expect(actualState).toEqual(expectedState);
  });

  it('getOrders rejected', () => {
    const errorMessage = 'Ошибка загрузки заказов';
    const expectedState: IOrdersState = {
      ...initialState,
      loading: false,
      error: errorMessage
    };

    const actualState = ordersReducer(
      { ...initialState, loading: true },
      {
        type: getOrders.rejected.type,
        payload: errorMessage
      }
    );

    expect(actualState).toEqual(expectedState);
  });

  it('fetchOrderByNumber pending', () => {
    const state = ordersReducer(
      initialState,
      fetchOrderByNumber.pending('', 123)
    );
    expect(state.orderLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fetchOrderByNumber fulfilled', () => {
    const order = {
      _id: '111',
      name: 'new Order',
      status: 'done',
      createdAt: '2025-11-21T08:23:46.399Z',
      updatedAt: '2025-11-21T08:23:46.588Z',
      number: 123,
      ingredients: ['1', '2', '3']
    };

    const expectedState: IOrdersState = {
      ...initialState,
      orderLoading: false,
      orderModal: order
    };

    const state = ordersReducer(
      { ...initialState, orderLoading: true },
      fetchOrderByNumber.fulfilled(order, '', 123)
    );

    expect(state).toEqual(expectedState);
  });

  it('fetchOrderByNumber rejected', () => {
    const errorMessage = 'Заказ не найден';
    const expectedState: IOrdersState = {
      ...initialState,
      orderLoading: false,
      error: errorMessage
    };

    const state = ordersReducer(
      { ...initialState, orderLoading: true },
      {
        type: fetchOrderByNumber.rejected.type,
        payload: errorMessage
      }
    );

    expect(state).toEqual(expectedState);
  });

  it('createOrder pending', () => {
    const state = ordersReducer(
      initialState,
      createOrder.pending('', ['ing1', 'ing2'])
    );
    expect(state.orderRequest).toBe(true);
    expect(state.error).toBeNull();
  });

  it('createOrder fulfilled', () => {
    const order = {
      _id: '222',
      name: 'New Order',
      status: 'created',
      createdAt: '2025-11-21T08:23:46.399Z',
      updatedAt: '2025-11-21T08:23:46.588Z',
      number: 222,
      ingredients: ['ing1', 'ing2']
    };

    const expectedState: IOrdersState = {
      ...initialState,
      loading: false,
      orderModal: order,
      orderRequest: false
    };

    const state = ordersReducer(
      { ...initialState, orderRequest: true, loading: true },
      createOrder.fulfilled(order, '', ['ing1', 'ing2'])
    );

    expect(state).toEqual(expectedState);
  });

  it('createOrder rejected', () => {
    const errorMessage = 'Ошибка создания заказа';
    const expectedState: IOrdersState = {
      ...initialState,
      orderRequest: false,
      error: errorMessage
    };

    const state = ordersReducer(
      { ...initialState, orderRequest: true },
      {
        type: createOrder.rejected.type,
        payload: errorMessage
      }
    );

    expect(state).toEqual(expectedState);
  });
});
