import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { thoat } from './authSlice';
import './header_menu.css';

function Menu() {
  const cartItemCount = useSelector(state => state.cart.listSP.length);
  const user = useSelector(state => state.auth.user);
  const daDangNhap = useSelector(state => state.auth.daDangNhap);
  const dispatch = useDispatch();
  
  // Thêm state cho tìm kiếm
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Xử lý khi người dùng nhập từ khóa
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowSuggestions(query.length > 0); // Hiển thị gợi ý nếu có từ khóa
  };

  // Xử lý khi nhấn nút tìm kiếm
  const handleSearchSubmit = () => {
    console.log('Tìm kiếm:', searchQuery);
    // Có thể thêm logic chuyển hướng hoặc gọi API tìm kiếm
    // Ví dụ: window.location.href = `/search?q=${searchQuery}`;
  };

  const Logout = () => {
    if (window.confirm('Bạn muốn đăng xuất?')) {
      dispatch(thoat());
    }
  };

  return React.createElement(    
    'div',
    { className: 'menu' },
    
    // Logo (giữ nguyên)
    React.createElement(
      'div',
      { className: 'box_menu' },
      React.createElement(
        NavLink,
        { to: '/', className: 'flex items-center' },
        React.createElement('img', {
          style: { width: '100px', height: '100px' },
          src: '../logofinal.jpeg',
          alt: 'Logo',
          className: 'h-12 w-auto cursor-pointer',
        })
      )
    ),

    // Menu điều hướng (giữ nguyên)
    React.createElement(
      'nav',
      { className: 'main-menu' },
      React.createElement(
        'ul',
        null,
        React.createElement(
          'li',
          null,
          React.createElement(NavLink, { to: '/san-pham', activeClassName: 'active' }, 'Sản phẩm'),
          React.createElement(
            'ul',
            { className: 'dropdown' },
            React.createElement('li', null, React.createElement(NavLink, { to: '/laptop' }, 'Laptop')),
            React.createElement('li', null, React.createElement(NavLink, { to: '/san-pham/pc' }, 'PC')),
            React.createElement('li', null, React.createElement(NavLink, { to: '/san-pham/phu-kien' }, 'Phụ kiện'))
          )
        ),
        React.createElement('li', null, React.createElement(NavLink, { to: '/khuyen-mai', activeClassName: 'active' }, 'Khuyến mãi')),
        React.createElement('li', null, React.createElement(NavLink, { to: '/tin-tuc', activeClassName: 'active' }, 'Tin tức')),
        React.createElement('li', null, React.createElement(NavLink, { to: '/lien-he', activeClassName: 'active' }, 'Liên hệ'))
      )
    ),

    // Thanh tìm kiếm mới
    React.createElement(
      'div',
      { className: 'search-container' },
      React.createElement(
        'input',
        {
          type: 'text',
          placeholder: 'Tìm kiếm sản phẩm',
          value: searchQuery,
          onChange: handleSearchChange,
          className: 'search-input',
        }
      ),
      React.createElement(
        'button',
        {
          type: 'button',
          className: 'search-button',
          onClick: handleSearchSubmit,
        },
        React.createElement('i', { className: 'bi bi-search' })
      ),
      showSuggestions && React.createElement(
        'div',
        { className: 'search-suggestions' },
        // Gợi ý tĩnh, có thể thay bằng dữ liệu động
        React.createElement('div', null, 'Laptop'),
        React.createElement('div', null, 'PC'),
        React.createElement('div', null, 'Phụ kiện')
      )
    ),

    // Menu người dùng và giỏ hàng (giữ nguyên)
    React.createElement(
      'div',
      { className: 'user-menu' },
      React.createElement(
        'button',
        { type: 'button', className: 'btn' },
        React.createElement(
          'ul',
          null,
          React.createElement(
            'li',
            { className: 'user_box', style: { listStyle: 'none' } },
            user === null || user === undefined
              ? React.createElement(
                  'div',
                  { className: 'user-actions' },
                  React.createElement(
                    NavLink,
                    { to: '/auth' },
                    React.createElement('i', { className: 'bi bi-person-circle' }),
                    ' Đăng nhập / Đăng ký'
                  )
                )
              : React.createElement('div', { style: { fontSize: '25px', color: 'white' } }, user.name),
            React.createElement(
              'ul',
              { className: 'box_an_us_adm' },
              React.createElement('div', { className: 'triangle-box_user' }),
              !daDangNhap
                ? React.createElement(
                    React.Fragment,
                    null,
                    React.createElement('li', null, React.createElement(NavLink, { to: '/#', className: 'menu-link' }, 'Thông tin cá nhân')),
                    React.createElement('li', null, React.createElement(NavLink, { to: '/auth', className: 'menu-link' }, 'Đăng nhập'))
                  )
                : React.createElement(
                    React.Fragment,
                    null,
                    React.createElement('li', null, React.createElement(NavLink, { to: '/doimatkhau', className: 'menu-link' }, 'Đổi mật khẩu')),
                    React.createElement(
                      'li',
                      null,
                      React.createElement(NavLink, { to: `/profile/${user.id}`, className: 'menu-link' }, 'Thông tin cá nhân')
                    ),
                    React.createElement('li', { className: 'divider' }),
                    React.createElement(
                      'li',
                      null,
                      React.createElement('button', { className: 'logout', onClick: Logout }, 'Đăng xuất')
                    )
                  )
            )
          )
        )
      )
    ),

    React.createElement(
      'div',
      { id: 'box_tim_gio_user', className: 'd-flex', role: 'search' },
      React.createElement(
        'button',
        { className: 'btn cart_box', type: 'button' },
        React.createElement(
          Link,
          { to: '/showcart', activeClassName: 'a' },
          React.createElement(
            'div',
            { className: 'cart' },
            React.createElement(
              'div',
              { className: 'about__box-icon' },
              React.createElement(
                'svg',
                { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 28.95 35.07', width: '25', height: '25' },
                React.createElement(
                  'defs',
                  null,
                  React.createElement(
                    'style',
                    null,
                    `.cls-1 { fill: none; stroke: #fff; stroke-linecap: round; stroke-linejoin: round; stroke-width: 1.8px; }`
                  )
                ),
                React.createElement(
                  'g',
                  { id: 'Layer_2', 'data-name': 'Layer 2' },
                  React.createElement(
                    'g',
                    { id: 'Layer_1-2', 'data-name': 'Layer 1' },
                    React.createElement('path', {
                      d: 'M10,10.54V5.35A4.44,4.44,0,0,1,14.47.9h0a4.45,4.45,0,0,1,4.45,4.45v5.19',
                      className: 'cls-1',
                    }),
                    React.createElement('path', {
                      d: 'M23.47,34.17h-18A4.58,4.58,0,0,1,.91,29.24L2.5,8.78A1.44,1.44,0,0,1,3.94,7.46H25a1.43,1.43,0,0,1,1.43,1.32L28,29.24A4.57,4.57,0,0,1,23.47,34.17Z',
                      className: 'cls-1',
                    })
                  )
                )
              )
            ),
            React.createElement(
              'div',
              { className: 'about__box-content' },
              React.createElement('p', { className: 'title' }, 'Giỏ hàng'),
              React.createElement('span', { id: 'items_in_cart' }, cartItemCount)
            )
          )
        )
      )
    )
  );
}

export default Menu;