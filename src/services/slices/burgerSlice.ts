import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

interface IBurgerState {
  bun: TConstructorIngredient | null; //булка
  ingredients: TConstructorIngredient[]; //ингредиенты
}
// начальное состояние
const initialState: IBurgerState = {
  bun: null, //булка
  ingredients: [] //ингредиенты
};

export const burgerSlice = createSlice({
  name: 'burger',
  initialState,
  reducers: {
    //добавить ингредиент
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const id = nanoid();
        return { payload: { ...ingredient, id } };
      }
    },
    //переложить ингредиенты
    transferIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const ingredients = state.ingredients;
      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= ingredients.length ||
        toIndex >= ingredients.length
      ) {
        return;
      }
      const [transferItem] = ingredients.splice(fromIndex, 1);
      ingredients.splice(toIndex, 0, transferItem);
    },
    //удалить ингредиент
    deleteIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    //удалить бургер
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  addIngredient,
  transferIngredient,
  deleteIngredient,
  clearConstructor
} = burgerSlice.actions;

export default burgerSlice.reducer;
