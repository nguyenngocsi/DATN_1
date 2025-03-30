import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCart, updateCartItem, removeFromCart, clearCart } from './redux/cartActions';
import './showCart.css';
import logo from './img/logo.png';

function ShowCart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { listSP, loading, error } = useSelector(state => state.cart);
  const user = useSelector(state => state.auth.user);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token || !user) {
      navigate('/login');
      return;
    }

    dispatch(fetchCart(user.id));
  }, [dispatch, user, token, navigate]);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    const product = listSP.find(item => item.id_sp === productId);
    if (product) {
      await dispatch(updateCartItem({
        userId: user.id,
        productId,
        quantity: newQuantity,
        price: product.gia,
        discountPrice: product.gia_km
      }));
    }
  };

  const handleRemoveItem = async (productId) => {
    await dispatch(removeFromCart({ userId: user.id, productId }));
  };

  const handleClearCart = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
      await dispatch(clearCart(user.id));
    }
  };

  const calculateTotal = () => {
    return listSP.reduce((total, item) => {
      const price = item.gia_km || item.gia || 0;
      return total + price * item.so_luong;
    }, 0);
  };

  if (!token || !user) return null;
  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Giỏ hàng của bạn</h1>
      </div>

      {listSP.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <p>Giỏ hàng của bạn đang trống</p>
          <p className="empty-cart-subtitle">Hãy chọn thêm sản phẩm để mua sắm nhé</p>
          <Link to="/" className="continue-shopping">
            Quay lại trang chủ
          </Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            <div className="cart-table">
              <div className="cart-table-header">
                <div className="col-product">Sản phẩm</div>
                <div className="col-price">Đơn giá</div>
                <div className="col-quantity">Số lượng</div>
                <div className="col-total">Thành tiền</div>
                <div className="col-action">Thao tác</div>
              </div>
              {listSP.map((item) => {
                const price = item.gia_km || item.gia || 0;
                const originalPrice = item.gia || 0;
                const hasDiscount = item.gia_km;
                const total = price * item.so_luong;

                return (
                  <div key={`${item.id_user}-${item.id_sp}`} className="cart-table-row">
                    <div className="col-product">
                      <div className="product-info">
                        <img
                          src={item.hinh || logo}  // Sửa ở đây: dùng URL trực tiếp
                          alt={item.ten_sp}
                          className="product-image"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = logo;
                          }}
                        />
                        <div className="product-details">
                          <h3>{item.ten_sp}</h3>
                        </div>
                      </div>
                    </div>
                    <div className="col-price">
                      <div className="price-info">
                        <span className="price">
                          {price.toLocaleString()} VND
                        </span>
                        {hasDiscount && (
                          <span className="original-price">
                            {originalPrice.toLocaleString()} VND
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-quantity">
                      <div className="quantity-controls">
                        <button
                          onClick={() => handleQuantityChange(item.id_sp, item.so_luong - 1)}
                          className="quantity-btn"
                        >
                          -
                        </button>
                        <span className="quantity">{item.so_luong}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id_sp, item.so_luong + 1)}
                          className="quantity-btn"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="col-total">
                      <span className="total-price">{total.toLocaleString()} VND</span>
                    </div>
                    <div className="col-action">
                      <button
                        onClick={() => handleRemoveItem(item.id_sp)}
                        className="remove-btn"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="cart-summary">
            <div className="summary-header">
              <h3>Tổng đơn hàng</h3>
            </div>
            <div className="summary-content">
              <div className="summary-row">
                <span>Tạm tính</span>
                <span>{calculateTotal().toLocaleString()} VND</span>
              </div>
              <div className="summary-row">
                <span>Phí vận chuyển</span>
                <span>Miễn phí</span>
              </div>
              <div className="summary-row total">
                <span>Tổng cộng</span>
                <span>{calculateTotal().toLocaleString()} VND</span>
              </div>
            </div>
            <div className="summary-actions">
              <button onClick={handleClearCart} className="clear-cart-btn">
                Xóa giỏ hàng
              </button>
              <Link to="/thanhtoan/" className="checkout-btn">
                Thanh toán
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShowCart;