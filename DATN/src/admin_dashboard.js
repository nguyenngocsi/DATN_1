import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { thoat } from './authSlice';
import { FiBox, FiUsers, FiList, FiShoppingCart } from 'react-icons/fi';
import './admin.css';
import { showNotification } from './components/NotificationContainer';

function AdminDashboard() {
  document.title = "Quản lý Dashboard";
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const Logout = () => {
    if(window.confirm('Bạn muốn đăng xuất?')) {
      dispatch(thoat());
      showNotification({
        type: 'info',
        title: 'Đăng xuất',
        message: 'Bạn đã đăng xuất thành công'
      });
      navigate('/');
    }
  };

  return (
    <div className="admin_product">
      <aside className="admin_product_aside">
        <div className="admin_product_aside_header">
          <div className="admin_product_aside_header_title_img">
            <img src={user.hinh} alt={user.hinh} />
            <h3>{user.name}</h3>
            <hr className="hr"/>
          </div>
          <div className="admin_product_aside_header_menu">
            <ul>
              <li><Link to="/admin"><i className="fa-solid fa-layer-group"></i> Quản lý Dashboard</Link></li>
              <li><Link to="/admin/category"><i className="bi bi-list-task"></i> Quản lý Danh mục</Link></li>
              <li><Link to="/admin/product"><i className="fa-solid fa-tags"></i> Quản lý sản phẩm</Link></li>
              <li><Link to="/admin/user"><i className="fa-solid fa-user"></i> Quản lý tài khoản</Link></li>
              <li><Link to="/admin/order"><i className="fa-solid fa-pen-to-square"></i> Quản lý đơn hàng</Link></li>
            </ul>
          </div>
          <div className="admin_product_aside_header_logout">
            <button 
              onClick={Logout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '8px 16px',
                cursor: 'pointer',
                width: '100%',
                transition: 'background-color 0.3s ease',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d32f2f'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f44336'}
            >
              <span>Đăng xuất</span>
              <i className="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>
        </div>
      </aside>

      <article className="admin_product_article">
        <div className="admin_product_article_header">
          <div className="admin_product_article_header_icon_logout">
            <Link to="/admin"><i className="bi bi-house-door-fill"></i></Link>
          </div>
        </div>

        <div className="admin_product_article_box_content">
          {/* Stats Cards */}
          <div className="dashboard-stats">
            <Link to="/admin/product" className="stat-card">
              <div className="stat-icon products">
                <FiBox />
              </div>
              <div className="stat-info">
                <div className="stat-value">4,997</div>
                <div className="stat-label">Quản lý sản phẩm</div>
              </div>
            </Link>

            <Link to="/admin/category" className="stat-card">
              <div className="stat-icon categories">
                <FiList />
              </div>
              <div className="stat-info">
                <div className="stat-value">12</div>
                <div className="stat-label">Quản lý danh mục</div>
              </div>
            </Link>

            <Link to="/admin/user" className="stat-card">
              <div className="stat-icon users">
                <FiUsers />
              </div>
              <div className="stat-info">
                <div className="stat-value">15</div>
                <div className="stat-label">Quản lý tài khoản</div>
              </div>
            </Link>

            <Link to="/admin/order" className="stat-card">
              <div className="stat-icon orders">
                <FiShoppingCart />
              </div>
              <div className="stat-info">
                <div className="stat-value">73</div>
                <div className="stat-label">Quản lý đơn hàng</div>
              </div>
            </Link>
          </div>

          {/* Recent Activity */}
          <div className="recent-activity">
            <div className="activity-header">
              <h3 className="activity-title">Hoạt động gần đây</h3>
            </div>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon new-product">
                  <FiBox />
                </div>
                <div className="activity-content">
                  <div className="activity-text">Sản phẩm mới được thêm vào</div>
                  <div className="activity-time">2 phút trước</div>
                </div>
              </div>

              <div className="activity-item">
                <div className="activity-icon new-user">
                  <FiUsers />
                </div>
                <div className="activity-content">
                  <div className="activity-text">Người dùng mới đăng ký</div>
                  <div className="activity-time">10 phút trước</div>
                </div>
              </div>

              <div className="activity-item">
                <div className="activity-icon new-order">
                  <FiShoppingCart />
                </div>
                <div className="activity-content">
                  <div className="activity-text">Đơn hàng mới được tạo</div>
                  <div className="activity-time">30 phút trước</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

export default AdminDashboard; 