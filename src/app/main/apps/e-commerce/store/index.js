import { combineReducers } from '@reduxjs/toolkit';
import shop from './shopSlice';
import shops from './shopsSlice';
import product from './productSlice';
import products from './productsSlice';

const reducer = combineReducers({
  products,
  product,
  shops,
  shop,
});

export default reducer;
