import { createSlice } from '@reduxjs/toolkit';
import { fetchCart, addToCart, updateCartItem, removeFromCart, clearCart } from './cartActions';

const initialState = {
  listSP: [],
  loading: false,
  error: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.listSP = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        const { product, quantity } = action.payload;
        const existingItem = state.listSP.find(item => item.id_sp === product.id);
        
        if (existingItem) {
          existingItem.so_luong += quantity;
        } else {
          state.listSP.push({
            id_sp: product.id,
            ten_sp: product.ten_sp,
            hinh: product.hinh,
            gia: product.gia,
            gia_km: product.gia_km,
            so_luong: quantity
          });
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update cart item
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        const { productId, quantity, price, discountPrice } = action.payload;
        const item = state.listSP.find(item => item.id_sp === productId);
        
        if (item) {
          item.so_luong = quantity;
          item.gia = price;
          item.gia_km = discountPrice;
        }
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.listSP = state.listSP.filter(item => item.id_sp !== action.payload);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Clear cart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.listSP = [];
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default cartSlice.reducer; 