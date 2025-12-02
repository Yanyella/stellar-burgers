import ingredientsReducer, {
  IngredientsState,
  initialState,
  getIngredients
} from './ingredientsSlice';

describe('тест ingredientsSlice', () => {
  it('начальное состояние', () => {
    const state = ingredientsReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  it('getIngredients pending', () => {
    const state = ingredientsReducer(initialState, getIngredients.pending(''));
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('getIngredients fulfilled', () => {
    const ingredients = [
      {
        _id: '643d69a5c3f7b9001cfa0941',
        id: '2',
        calories: 4242,
        carbohydrates: 242,
        fat: 142,
        image: 'image-2',
        image_large: 'image-large-2',
        image_mobile: 'image-mobile-2',
        name: 'Биокотлета из марсианской Магнолии',
        price: 424,
        proteins: 420,
        type: 'main'
      }
    ];

    const expectedState: IngredientsState = {
      ingredients,
      isLoading: false,
      error: null
    };

    const actualState = ingredientsReducer(
      {
        ...initialState,
        isLoading: true
      },
      getIngredients.fulfilled(ingredients, '', undefined)
    );

    expect(actualState).toEqual(expectedState);
  });

  it('getIngredients rejected', () => {
    const errorMessage = 'Ошибка загрузки ингредиентов';
    const expectedState: IngredientsState = {
      ...initialState,
      isLoading: false,
      error: errorMessage
    };

    const actualState = ingredientsReducer(
      { ...initialState, isLoading: true },
      {
        type: getIngredients.rejected.type,
        payload: errorMessage
      }
    );

    expect(actualState).toEqual(expectedState);
  });
});
