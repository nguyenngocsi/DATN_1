import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { thoat } from './authSlice';
import './header_menu.css';

function Menu() {
  const cartItemCount = useSelector(state => state.cart.listSP.length);
  const user = useSelector(state => state.auth.user);
  const daDangNhap = useSelector(state => state.auth.daDangNhap);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Thêm useEffect để debug
  useEffect(() => {
    console.log('Debug info:');
    console.log('daDangNhap:', daDangNhap);
    console.log('userId:', localStorage.getItem("userId"));
    console.log('token:', localStorage.getItem("token"));
    console.log('user:', user);
  }, [daDangNhap, user]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowSuggestions(query.length > 0);
  };

  const handleSearchSubmit = () => {
    console.log('Tìm kiếm:', searchQuery);
  };

  const Logout = () => {
    if (window.confirm('Bạn muốn đăng xuất?')) {
      localStorage.removeItem("userId"); // Xóa userId khỏi localStorage
      localStorage.removeItem("token");  // Xóa token khỏi localStorage nếu có
      dispatch(thoat());
    }
  };

  return (
    <div className="menu">
      {/* Logo */}
      <div className="box_menu">
        <NavLink to="/" className="flex items-center">
          <img
            style={{ width: '100px', height: '100px' }}
            src="../logofinal.jpeg"
            alt="Logo"
            className="h-12 w-auto cursor-pointer"
          />
        </NavLink>
      </div>

      {/* Menu điều hướng */}
      <nav className="main-menu">
        <ul>
          <li>
            <NavLink to="/san-pham" activeClassName="active">Sản phẩm</NavLink>
            <ul className="dropdown">
              <li><NavLink to="/laptop">Laptop</NavLink></li>
              <li><NavLink to="/san-pham/pc">PC</NavLink></li>
              <li><NavLink to="/san-pham/phu-kien">Phụ kiện</NavLink></li>
            </ul>
          </li>
          <li><NavLink to="/khuyen-mai" activeClassName="active">Khuyến mãi</NavLink></li>
          <li><NavLink to="/tin-tuc" activeClassName="active">Tin tức</NavLink></li>
          <li><NavLink to="/lien-he" activeClassName="active">Liên hệ</NavLink></li>
        </ul>
      </nav>

      {/* Thanh tìm kiếm */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm"
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
        <button type="button" className="search-button" onClick={handleSearchSubmit}>
          <i className="bi bi-search"></i>
        </button>
        {showSuggestions && (
          <div className="search-suggestions">
            <div>Laptop</div>
            <div>PC</div>
            <div>Phụ kiện</div>
          </div>
        )}
      </div>

      {/* Menu người dùng */}
      <div className="user-menu">
        <div className="user-profile-dropdown">
          {user === null || user === undefined ? (
            <NavLink to="/auth" className="user-actions">
              <i className="bi bi-person-circle"></i> Đăng nhập / Đăng ký
            </NavLink>
          ) : (
            <>
              <div className="user-info">
                <i className="bi bi-person-circle"></i>
                <span>{user.name}</span>
              </div>
              <ul className="dropdown-menu">
                <li>
                  <NavLink 
                    to={`/profile/${localStorage.getItem("userId")}`}
                    className="menu-link"
                    onClick={(e) => {
                      if (!localStorage.getItem("token")) {
                        e.preventDefault();
                        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                        navigate("/auth");
                      }
                    }}
                  >
                    <i className="bi bi-person"></i>
                    Thông tin cá nhân
                  </NavLink>
                </li>
                <li><NavLink to="/doimatkhau" className="menu-link">
                  <i className="bi bi-key"></i>
                  Đổi mật khẩu
                </NavLink></li>
                <li className="divider"></li>
                <li>
                  <button className="logout" onClick={Logout}>
                    <i className="bi bi-box-arrow-right"></i>
                    Đăng xuất
                  </button>
                </li>
              </ul>
            </>
          )}
        </div>
      </div>

      {/* Giỏ hàng */}
      <div id="box_tim_gio_user" className="d-flex" role="search">
        <button className="btn cart_box" type="button">
          <Link to="/showcart" activeClassName="a">
            <div className="cart">
              <div className 모두="about__box-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28.95 35.07" width="25" height="25">
                  <defs>
                    <style>{`.cls-1 { fill: none; stroke: #fff; stroke-linecap: round; stroke-linejoin: round; stroke-width: 1.8px; }`}</style>
                  </defs>
                  <g id="Layer_2" data-name="Layer 2">
                    <g id="Layer_1-2" data-name="Layer 1">
                      <path d="M10,10.54V5.35A4.44,4.44,0,0,1,14.47.9h0a4.45,4.45,0,0,1,4.45,4.45v5.19" className="cls-1" />
                      <path d="M23.47,34.17h-18A4.58,4.58,0,0,1,.91,29.24L2.5,8.78A1.44,1.44,0,0,1,3.94,7.46H25a1.43,1.43,0,0,1,1.43,1.32L28,29.24A4.57,4.57,0,0,1,23.47,34.17Z" className="cls-1" />
                    </g>
                  </g>
                </svg>
              </div>
              <div className="about__box-content">
                <p className="title">Giỏ hàng</p>
                <span id="items_in_cart">{cartItemCount}</span>
              </div>
            </div>
          </Link>
        </button>
      </div>
    </div>
  );
}

export default Menu;