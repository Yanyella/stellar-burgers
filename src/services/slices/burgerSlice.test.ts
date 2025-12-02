import { TConstructorIngredient } from '@utils-types';
import burgerReducer, {
  addIngredient,
  transferIngredient,
  deleteIngredient,
  clearConstructor,
  initialState
} from './burgerSlice';

describe('тест burgerSlice', () => {
  //моковые данные
  const ingredient1: TConstructorIngredient = {
    _id: '643d69a5c3f7b9001cfa093c',
    id: '1',
    calories: 420,
    carbohydrates: 53,
    fat: 24,
    image: 'image-1',
    image_large: 'image-large-1',
    image_mobile: 'image-mobile-1',
    name: 'Краторная булка N-200i',
    price: 1255,
    proteins: 80,
    type: 'bun'
  };
  const ingredient2: TConstructorIngredient = {
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
  };
  const ingredient3: TConstructorIngredient = {
    _id: '643d69a5c3f7b9001cfa0942',
    id: '3',
    calories: 30,
    carbohydrates: 40,
    fat: 20,
    image: 'image-3',
    image_large: 'image-large-3',
    image_mobile: 'image-mobile-3',
    name: 'Соус Spicy-X',
    price: 90,
    proteins: 30,
    type: 'main'
  };
  const burgerState = {
    bun: ingredient1,
    ingredients: [ingredient2, ingredient3]
  };

  it('add bun', () => {
    const state = burgerReducer(initialState, addIngredient(ingredient1));
    expect(state.ingredients).toHaveLength(0);
    expect(state.bun?._id).toEqual('643d69a5c3f7b9001cfa093c');
  });
  it('add ingredient', () => {
    const state = burgerReducer(burgerState, addIngredient(ingredient2));
    expect(state.ingredients).toHaveLength(3);
    expect(state.ingredients[2]._id).toEqual('643d69a5c3f7b9001cfa0941');
  });

  it('transferIngredient', () => {
    const state = burgerReducer(
      burgerState,
      transferIngredient({ fromIndex: 0, toIndex: 1 })
    );
    expect(state.ingredients[0]._id).toEqual('643d69a5c3f7b9001cfa0942');
    expect(state.ingredients[1]._id).toEqual('643d69a5c3f7b9001cfa0941');
  });

  it('deleteIngredient', () => {
    const state = burgerReducer(burgerState, deleteIngredient('2'));
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]._id).toEqual('643d69a5c3f7b9001cfa0942');
  });

  it('clearConstructor', () => {
    const state = burgerReducer(burgerState, clearConstructor());
    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(0);
  });
});
