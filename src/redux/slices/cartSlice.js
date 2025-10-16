import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  totalPrice: 0,
  items: [],
};

const changePrice = (state) => {
  state.totalPrice = state.items.reduce((sum, obj) => sum + obj.price * obj.count, 0);
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      const findItem = state.items.find((obj) => obj.id === action.payload.id);

      if (findItem) {
        findItem.count++;
      } else {
        state.items.push({
          ...action.payload,
          count: 1,
        });
      }

      changePrice(state);
    },
    plusItem(state, action) {
      const findItem = state.items.find((obj) => obj.id === action.payload.id);

      if (findItem) {
        findItem.count++;
      }
      changePrice(state);
    },
    minusItem(state, action) {
      const findItem = state.items.find((obj) => obj.id === action.payload.id);

      if (findItem) {
        findItem.count--;
      }
      changePrice(state);
    },
    removeItem(state, action) {
      state.items = state.items.filter((obj) => obj.id !== action.payload.id);

      changePrice(state);
    },
    clearItems(state) {
      state.items = [];
      changePrice(state);
    },
  },
});

export const { addItem, removeItem, clearItems, plusItem, minusItem } = cartSlice.actions;

export default cartSlice.reducer;
