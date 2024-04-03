import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import FuseUtils from '@fuse/utils';

export const getStore = createAsyncThunk('eCommerceApp/store/getStore', async (storeId) => {
  const response = await axios.get(`/api/ecommerce/stores/${storeId}`);
  const data = await response.data;

  return data === undefined ? null : data;
});

export const removeStore = createAsyncThunk(
  'eCommerceApp/product/removeProduct',
  async (val, { dispatch, getState }) => {
    const { id } = getState().eCommerceApp.product;
    await axios.delete(`/api/ecommerce/stores/${id}`);
    return id;
  }
);

export const saveStore = createAsyncThunk(
  'eCommerceApp/product/saveProduct',
  async (productData, { dispatch, getState }) => {
    const { id } = getState().eCommerceApp;

    const response = await axios.put(`/api/ecommerce/stores/${id}`, productData);

    const data = await response.data;

    return data;
  }
);

const storeSlice = createSlice({
  name: 'eCommerceApp/store',
  initialState: null,
  reducers: {
    resetStore: () => null,
    store: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          name: '',
        phone:'',
        address:'',
        state: '',
        city: '',
        district:'',
        logo:'',
        },
      }),
    },
  },
  extraReducers: {
    [getStore.fulfilled]: (state, action) => action.payload,
    [saveStore.fulfilled]: (state, action) => action.payload,
    [removeStore.fulfilled]: (state, action) => null,
  },
});

export const { newStore, resetStore } = storeSlice.actions;

export const selectStore = ({ eCommerceApp }) => eCommerceApp.store;

export default storeSlice.reducer;
