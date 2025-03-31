import { Link, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { thoat } from './authSlice';
import { useState, useEffect } from "react";
import moment from 'moment';
import './admin.css';
import { showNotification } from './components/NotificationContainer';

function AdminOrder() {
    document.title = "Quản lý Đơn hàng";
    const navigate = useNavigate();
    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, [currentPage, itemsPerPage, refresh]);

    const fetchOrders = async () => {
        try {
            const response = await fetch("http://localhost:3000/admin/orders");
            const data = await response.json();
            setOrders(data);
            setTotalPages(Math.ceil(data.length / itemsPerPage));
            setLoading(false);
        } catch (error) {
            console.error("Error fetching orders:", error);
            setLoading(false);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(parseInt(event.target.value));
        setCurrentPage(1);
    };

    // Tính toán orders cho trang hiện tại
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:3000/admin/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                showNotification({
                    type: 'success',
                    title: 'Thành công',
                    message: 'Cập nhật trạng thái đơn hàng thành công!'
                });
                setRefresh(prev => !prev);
            } else {
                showNotification({
                    type: 'error',
                    title: 'Lỗi',
                    message: 'Có lỗi xảy ra khi cập nhật trạng thái đơn hàng'
                });
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            showNotification({
                type: 'error',
                title: 'Lỗi',
                message: 'Có lỗi xảy ra khi cập nhật trạng thái đơn hàng'
            });
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Chờ xác nhận':
                return 'status-pending';
            case 'Đã xác nhận':
                return 'status-confirmed';
            case 'Đang giao hàng':
                return 'status-shipping';
            case 'Đã giao hàng':
                return 'status-delivered';
            case 'Đã hủy':
                return 'status-cancelled';
            default:
                return '';
        }
    };

    const Logout = () => {
        if (window.confirm('Bạn muốn đăng xuất?')) {
        dispatch(thoat());
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
                              <p>Đăng xuất</p>
                              <Link to="/#" onClick={Logout}><i className="fa-solid fa-right-from-bracket"></i></Link>
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
                    <div className="admin_product_article_box_content_title">
                        <h2>Quản lý Đơn hàng</h2>
                    </div>
                    <div className="admin_product_article_box_content_bang">
                        <div className="filter-section" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                Hiển thị <select value={itemsPerPage} onChange={handleItemsPerPageChange} className="form-select" style={{ display: 'inline-block', width: 'auto', marginLeft: '10px' }}>
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select> đơn hàng mỗi trang
                            </div>
                        </div>
                        {loading ? (
                            <div className="text-center" style={{marginTop:'20px'}}>
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <>
                                <table className="admin_product_article_box_content_bang_table">
                                    <thead>
                                        <tr>
                                            <th>Mã ĐH</th>
                                            <th>Khách hàng</th>
                                            <th>Ngày đặt</th>
                                            <th>Tổng tiền</th>
                                            <th>Trạng thái</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentOrders.map((order) => (
                                            <tr key={order.id}>
                                                <td>#{order.id}</td>
                                                <td>{order.ten_kh}</td>
                                                <td>{moment(order.ngay_dat).format('DD/MM/YYYY')}</td>
                                                <td>{parseInt(order.tong_tien).toLocaleString('vi-VN')} VNĐ</td>
                                                <td>
                                                    <span className={`status-badge ${getStatusClass(order.trang_thai)}`}>
                                                        {order.trang_thai}
                                                    </span>
                                                </td>
                                                <td>
                                                    <select 
                                                        className="form-select"
                                                        value={order.trang_thai}
                                                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                    >
                                                        <option value="Chờ xác nhận">Chờ xác nhận</option>
                                                        <option value="Đã xác nhận">Đã xác nhận</option>
                                                        <option value="Đang giao hàng">Đang giao hàng</option>
                                                        <option value="Đã giao hàng">Đã giao hàng</option>
                                                        <option value="Đã hủy">Đã hủy</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="pagination-container">
                                    <div className="pagination-info">
                                        Hiển thị {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, orders.length)} trên tổng số {orders.length} đơn hàng
                                    </div>
                                    <div className="pagination-controls">
                                        <button 
                                            onClick={() => handlePageChange(1)} 
                                            disabled={currentPage === 1}
                                            className="pagination-button"
                                        >
                                            <i className="fas fa-angle-double-left"></i>
                                        </button>
                                        <button 
                                            onClick={() => handlePageChange(currentPage - 1)} 
                                            disabled={currentPage === 1}
                                            className="pagination-button"
                                        >
                                            <i className="fas fa-angle-left"></i>
                                        </button>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                                            .filter(num => Math.abs(num - currentPage) <= 2 || num === 1 || num === totalPages)
                                            .map((number) => (
                                                <button
                                                    key={number}
                                                    onClick={() => handlePageChange(number)}
                                                    className={`pagination-button ${currentPage === number ? 'active' : ''}`}
                                                >
                                                    {number}
                                                </button>
                                            ))}
                                        <button 
                                            onClick={() => handlePageChange(currentPage + 1)} 
                                            disabled={currentPage === totalPages}
                                            className="pagination-button"
                                        >
                                            <i className="fas fa-angle-right"></i>
                                        </button>
                                        <button 
                                            onClick={() => handlePageChange(totalPages)} 
                                            disabled={currentPage === totalPages}
                                            className="pagination-button"
                                        >
                                            <i className="fas fa-angle-double-right"></i>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </article>
        </div>
    );
}

export default AdminOrder;