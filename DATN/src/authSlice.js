import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  daDangNhap: false,
  user: null,
  token: null,
  expiresIn: 0,
};

export const authSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    thoat: (state) => {
      const staySignedIn = localStorage.getItem("staySignedIn") === "true";
      Object.assign(state, initialState);
      localStorage.removeItem("userId");
      if (!staySignedIn) {
        localStorage.removeItem("token"); // Xóa token nếu không chọn "Duy trì đăng nhập"
      }
      localStorage.removeItem("staySignedIn");
      console.log("Người dùng đã đăng xuất.");
    },
    dalogin: (state, action) => {
      const { token, expiresIn, userInfo } = action.payload || {};

      if (!token || !userInfo) {
        console.error("Lỗi đăng nhập: Thiếu thông tin từ server!");
        return;
      }

      state.token = token;
      state.expiresIn = expiresIn || 0;
      state.user = userInfo;
      state.daDangNhap = true;

      console.log("✅ Đã ghi nhận state đăng nhập:", state.user);
    },
  },
});

export const { dalogin, thoat } = authSlice.actions;
export default authSlice.reducer;