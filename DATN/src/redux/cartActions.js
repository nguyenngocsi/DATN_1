import { createAsyncThunk } from '@reduxjs/toolkit';

// Lấy giỏ hàng từ database
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }

      const response = await fetch(`http://localhost:3000/gio-hang/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 403) {
        throw new Error('Bạn không có quyền truy cập giỏ hàng này');
      }

      if (!response.ok) {
        throw new Error('Không thể lấy giỏ hàng');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thêm sản phẩm vào giỏ hàng
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ userId, product, quantity }, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:3000/gio-hang', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          id_user: userId,
          id_sp: product.id,
          so_luong: quantity,
          gia: product.gia,
          gia_km: product.gia_km
        })
      });
      if (!response.ok) {
        throw new Error('Không thể thêm sản phẩm vào giỏ hàng');
      }
      const data = await response.json();
      return { product, quantity };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ userId, productId, quantity, price, discountPrice }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3000/gio-hang/${userId}/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          so_luong: quantity,
          gia: price,
          gia_km: discountPrice
        })
      });
      if (!response.ok) {
        throw new Error('Không thể cập nhật giỏ hàng');
      }
      const data = await response.json();
      return { productId, quantity, price, discountPrice };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3000/gio-hang/${userId}/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error('Không thể xóa sản phẩm khỏi giỏ hàng');
      }
      return productId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Xóa toàn bộ giỏ hàng
export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3000/gio-hang/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error('Không thể xóa giỏ hàng');
      }
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
); 