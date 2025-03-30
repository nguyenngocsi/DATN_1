import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { xoaGH } from "./cartSlice";
import { useNavigate } from "react-router-dom";

function ThanhToan() {
  const [user, setUser] = useState(null);
  const cart = useSelector(state => state.cart.listSP);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalAmount = cart.reduce((total, sp) => total + (sp.gia * sp.so_luong), 0);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) {
      alert("Không tìm thấy userId hoặc token, vui lòng đăng nhập lại!");
      navigate("/login");
      return;
    }

    fetch(`http://localhost:3000/profile/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) throw new Error(`Lỗi ${response.status}`);
        return response.json();
      })
      .then(data => {
        if (data.id) setUser(data);
        else alert("Không tìm thấy thông tin người dùng!");
      })
      .catch(error => {
        console.error("Lỗi tải thông tin user:", error);
        alert("Có lỗi khi tải thông tin user, vui lòng thử lại!");
        navigate("/login");
      });
  }, [navigate]);

  const submitDuLieu = () => {
    if (!user) {
      alert("Thông tin user bị thiếu!");
      return;
    }

    let url = "http://localhost:3000/luudonhang";
    let tt = {
      ho_ten: user.name,
      email: user.email,
      sdt: user.dien_thoai,
      address: user.dia_chi,
      tongtien: totalAmount
    };
    let opt = {
      method: "POST",
      body: JSON.stringify(tt),
      headers: { 'Content-Type': 'application/json' }
    };

    fetch(url, opt)
      .then(res => res.json())
      .then(data => {
        if (data.id_dh < 0) {
          console.log("Lỗi lưu đơn hàng", data);
        } else {
          let id_dh = data.id_dh;
          alert("Đã lưu đơn hàng: " + id_dh);
          luuchitietdonhang(id_dh, cart);
          navigate('/thanks');
        }
      })
      .catch(error => console.error("Lỗi đặt hàng:", error));
  };

  const luuchitietdonhang = (id_dh, cart) => {
    let url = "http://localhost:3000/luugiohang";
    cart.forEach(sp => {
      let t = { id_dh: id_dh, id_sp: sp.id, so_luong: sp.so_luong };
      let opt = {
        method: "POST",
        body: JSON.stringify(t),
        headers: { 'Content-Type': 'application/json' }
      };
      fetch(url, opt)
        .then(res => res.json())
        .then(() => dispatch(xoaGH(sp.id)))
        .catch(err => console.log('Lỗi lưu SP', sp));
    });
  };

  if (!user) return <p>Đang tải thông tin...</p>;

  return (
    <div className="box_tong_TT">
      <h2>Thông tin Thanh Toán</h2>
      <p><strong>Họ tên:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Số điện thoại:</strong> {user.dien_thoai}</p>
      <p><strong>Địa chỉ:</strong> {user.dia_chi}</p>
      <p><strong>Tổng tiền:</strong> {totalAmount.toLocaleString()} VND</p>

      <h3>Giỏ hàng của bạn</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((sp, index) => (
            <tr key={index}>
              <td>{sp.ten}</td>
              <td>{sp.gia.toLocaleString()} VND</td>
              <td>{sp.so_luong}</td>
              <td>{(sp.gia * sp.so_luong).toLocaleString()} VND</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="button_TT" onClick={submitDuLieu}>Thanh Toán</button>
    </div>
  );
}

export default ThanhToan;