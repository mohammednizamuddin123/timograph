import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';

const API_URL = import.meta.env.REACT_API_URL || 'http://localhost:3000';

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/users/cart`);
    return response.data.cart;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch cart');
  }
});

export const addToCart = createAsyncThunk('cart/addToCart', async ({ productId, quantity }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/users/cart/add`, { productId, quantity });
    return response.data.cart;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to add to cart');
  }
});

export const updateCartQuantity = createAsyncThunk('cart/updateCartQuantity', async ({ productId, quantity }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/users/cart/update`, { productId, quantity });
    return response.data.cart;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to update cart quantity');
  }
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (productId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/users/cart/remove/${productId}`);
    return response.data.cart;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to remove from cart');
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload?.items || [];
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload?.items || [];
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.items = action.payload?.items || [];
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload?.items || [];
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
