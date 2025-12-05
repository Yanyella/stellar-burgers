import feedReducer, {
  getFeeds,
  getOrderByNumber,
  initialState,
  TFeedsState
} from './feedSlice';

describe('тест feedSlice', () => {
  it('начальное состояние', () => {
    const state: TFeedsState = {
      ...initialState,
      isLoading: false
    };
    const action = { type: 'feed/getFeeds/pending' };
    const newState = feedReducer(state, action);
    expect(newState.isLoading).toBe(true);
  });

  it('getFeeds fulfilled', () => {
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
    const total = 18911;
    const totalToday = 111;
    const feedResponse = { success: true, orders, total, totalToday };
    const expectedState: TFeedsState = {
      orders,
      total,
      totalToday,
      isLoading: false,
      error: null
    };
    const actualState = feedReducer(
      {
        ...initialState,
        isLoading: true
      },
      getFeeds.fulfilled(feedResponse, '', undefined)
    );
    expect(actualState).toEqual(expectedState);
  });

  it('getFeeds rejected', () => {
    const errorMessage = 'Ошибка';
    const expectedState: TFeedsState = {
      ...initialState,
      isLoading: false,
      error: errorMessage
    };
    const rejectedAction = {
      type: getFeeds.rejected.type,
      payload: errorMessage,
      error: { message: errorMessage }
    };
    const actualState = feedReducer(
      { ...initialState, isLoading: true },
      rejectedAction
    );
    expect(actualState).toEqual(expectedState);
  });

  it('getOrderByNumber pending', () => {
    const state = feedReducer(initialState, getOrderByNumber.pending('', 111));
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('getOrderByNumber fulfilled', () => {
    const order = {
      _id: '111',
      name: 'Test Order',
      status: 'done',
      createdAt: '2025-11-21T08:23:46.399Z',
      updatedAt: '2025-11-21T08:23:46.588Z',
      number: 123,
      ingredients: ['1', '2']
    };

    const state = feedReducer(
      { ...initialState, isLoading: true, error: 'error' },
      getOrderByNumber.fulfilled(order, '', 123)
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('getOrderByNumber rejected', () => {
    const errorMessage = 'Заказ не найден';
    const rejectedAction = {
      type: getOrderByNumber.rejected.type,
      payload: errorMessage,
      error: { message: errorMessage }
    };
    const state = feedReducer(
      { ...initialState, isLoading: true },
      rejectedAction
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});
