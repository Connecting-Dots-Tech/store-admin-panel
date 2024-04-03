import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const getShops = createAsyncThunk('eCommerceApp/stores/getStores', async () => {
  const response = await axios.get('/api/ecommerce/stores');
  const data = await response.data;

  return data;
});

export const removeShops = createAsyncThunk(
  'eCommerceApp/stores',
  async (storeIds, { dispatch, getState }) => {
    await axios.delete('/api/ecommerce/stores', { data: storeIds });

    return storeIds;
  }
);

const shopsAdapter = createEntityAdapter({});

export const { selectAll: selectShops, selectById: selectShopById } = shopsAdapter.getSelectors((state) => {
  return state.eCommerceApp.shops;
});
const  storesSlice = createSlice({
  name: 'eCommerceApp/stores',
  initialState: shopsAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setProductsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [getShops.fulfilled]: shopsAdapter.setAll,
    [removeShops.fulfilled]: (state, action) =>
    shopsAdapter.removeMany(state, action.payload),
  },
});

export const { setProductsSearchText } = storesSlice.actions;

export const selectShopsSearchText = ({ eCommerceApp }) => eCommerceApp.shops.searchText;

export default storesSlice.reducer;
