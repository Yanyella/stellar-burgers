import store from './store';
import { initialState as feedInit } from './slices/feedSlice';
import { initialState as burgerInit } from './slices/burgerSlice';
import { initialState as ingredientInit } from './slices/ingredientsSlice';
import { initialState as orderInit } from './slices/orderSlice';
import { initialState as userInit } from './slices/userSlice';

describe('rootReducer', () => {
  it('Проверка корректности начальных состояний каждого редьюсера', () => {
    const state = store.getState();
    expect(state.feed).toEqual(feedInit);
    expect(state.burger).toEqual(burgerInit);
    expect(state.ingredients).toEqual(ingredientInit);
    expect(state.orders).toEqual(orderInit);
    expect(state.user).toEqual(userInit);
  });
  it('Проверка типов данных в состоянии', () => {
    const state = store.getState();

    // Проверяем структуру состояния
    expect(typeof state).toBe('object');
    expect(Object.keys(state)).toHaveLength(5);

    // Проверяем типы значений для каждого редьюсера
    expect(typeof state.feed).toBe('object');
    expect(typeof state.burger).toBe('object');
    expect(typeof state.ingredients).toBe('object');
    expect(typeof state.orders).toBe('object');
    expect(typeof state.user).toBe('object');
  });
  it('Проверка наличия всех редьюсеров в store', () => {
    const state = store.getState();

    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('burger');
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('orders');
    expect(state).toHaveProperty('user');
  });
  it('Проверка корректности store', () => {
    expect(store).toBeDefined();
    expect(typeof store.dispatch).toBe('function');
    expect(typeof store.getState).toBe('function');
    expect(typeof store.subscribe).toBe('function');
  });
});
