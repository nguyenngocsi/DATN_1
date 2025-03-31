import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { thoat } from './authSlice';
import AdminProductThem from "./admin_product_Them";
import AdminProductSua from "./admin_product_Sua";
import './admin.css';
import { showNotification } from './components/NotificationContainer';

function AdminProduct() {
    document.title = "Quản lý sản phẩm";
    const navigate = useNavigate();

    const [adminListSP, ganadminListSP] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState([]); 
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();
    
    // Thêm state để lưu ID sản phẩm cần xóa
    const [productToDelete, setProductToDelete] = useState(null);
    
    useEffect(() => {
        fetch("http://localhost:3000/admin/sp")
            .then(res => res.json())
            .then(data => {
                // Chuyển đổi ID sang số và lọc bỏ các ID không hợp lệ
                const validData = data
                    .map(item => ({
                        ...item,
                        id: parseInt(item.id)
                    }))
                    .filter(item => !isNaN(item.id));

                // Sắp xếp theo ID tăng dần
                const sortedData = validData.sort((a, b) => a.id - b.id);
                
                ganadminListSP(sortedData);
                setTotalPages(Math.ceil(sortedData.length / itemsPerPage));
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                showNotification({
                    type: 'error',
                    title: 'Lỗi',
                    message: 'Không thể tải danh sách sản phẩm'
                });
            });
    }, [refresh, itemsPerPage]);

    // Tính toán sản phẩm cho trang hiện tại
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = adminListSP.slice(indexOfFirstItem, indexOfLastItem);

    // Tính toán range của items đang hiển thị
    const firstItemIndex = indexOfFirstItem + 1;
    const lastItemIndex = Math.min(indexOfLastItem, adminListSP.length);

    // Xử lý thay đổi trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Xử lý thay đổi số items mỗi trang
    const handleItemsPerPageChange = (event) => {
        const newItemsPerPage = parseInt(event.target.value);
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1); // Reset về trang 1 khi thay đổi số items/trang
        setTotalPages(Math.ceil(adminListSP.length / newItemsPerPage));
    };

    const handleDeleteClick = (product) => {
        if (!product || !product.id) {
            showNotification({
                type: 'error',
                title: 'Lỗi',
                message: 'Không thể xác định sản phẩm để xóa'
            });
            return;
        }
        setProductToDelete(product.id);
        setSelectedProduct(product);
    };

    const handleConfirmDelete = async () => {
        const idToDelete = productToDelete;
        
        if (!idToDelete) {
            showNotification({
                type: 'error',
                title: 'Lỗi',
                message: 'Không tìm thấy sản phẩm để xóa'
            });
            return;
        }

        try {
            console.log('Deleting product with ID:', idToDelete);
            const response = await fetch(`http://localhost:3000/admin/sp/${idToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            console.log('Delete response:', data);
            
            if (!response.ok || data.error) {
                showNotification({
                    type: 'error',
                    title: 'Lỗi',
                    message: data.thongbao || 'Không thể xóa sản phẩm'
                });
                return;
            }

            showNotification({
                type: 'success',
                title: 'Thành công',
                message: 'Đã xóa sản phẩm thành công'
            });

            // Cập nhật lại danh sách sản phẩm
            const updatedList = adminListSP.filter(item => item.id !== idToDelete);
            ganadminListSP(updatedList);
            setTotalPages(Math.ceil(updatedList.length / itemsPerPage));

            // Nếu đang ở trang cuối và trang hiện tại không còn sản phẩm nào, chuyển về trang trước
            if (currentItems.length === 1 && currentPage > 1) {
                setCurrentPage(prev => prev - 1);
            }

            // Reset state sau khi đã xử lý xong
            setProductToDelete(null);
            setSelectedProduct(null);
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm:', error);
            showNotification({
                type: 'error',
                title: 'Lỗi',
                message: 'Có lỗi xảy ra khi xóa sản phẩm'
            });
        }
    };

    const selectProduct = (product) => {
        setSelectedProduct(product);
    };

    const Logout = () => {
        showNotification({
            type: 'warning',
            title: 'Đăng xuất',
            message: 'Bạn có chắc chắn muốn đăng xuất?',
            onConfirm: () => {
            dispatch(thoat());
                showNotification({
                    type: 'info',
                    title: 'Đăng xuất',
                    message: 'Bạn đã đăng xuất thành công'
                });
                navigate('/');
            }
        });
    };

    // Tính toán số trang để hiển thị (tối đa 5 trang)
    const getPageNumbers = () => {
        const totalPageNumbers = 5;
        const pageNumbers = [];
        
        if (totalPages <= totalPageNumbers) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        // Luôn hiển thị trang đầu, trang cuối và các trang xung quanh trang hiện tại
        if (currentPage <= 3) {
            for (let i = 1; i <= 4; i++) {
                pageNumbers.push(i);
            }
            pageNumbers.push('...');
            pageNumbers.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
            pageNumbers.push(1);
            pageNumbers.push('...');
            for (let i = totalPages - 3; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            pageNumbers.push(1);
            pageNumbers.push('...');
            for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                pageNumbers.push(i);
            }
            pageNumbers.push('...');
            pageNumbers.push(totalPages);
        }

        return pageNumbers;
    };

    // Thêm hàm lấy ID tiếp theo
    const getNextProductId = () => {
        if (!adminListSP || adminListSP.length === 0) return 1;
        
        // Lấy ID lớn nhất và cộng 1
        const maxId = Math.max(...adminListSP.map(item => parseInt(item.id) || 0));
        return maxId + 1;
    };

    return (
        <div className="admin_product">
            <aside className="admin_product_aside">
                <div className="admin_product_aside_header">
                    <div className="admin_product_aside_header_title_img">
                        <img src={user.hinh} alt={user.hinh} />
                        <h3>{user.name}</h3>
                        <hr className="hr" />
                    </div>
                    <div className="admin_product_aside_header_menu">
                        <ul>
                            <li><Link to="/admin"><i className="fa-solid fa-layer-group"></i> Quản lý dashboard</Link></li>
                            <li><Link to="/admin/category"><i className="bi bi-list-task"></i> Quản lý danh mục</Link></li>
                            <li><Link to="/admin/product"><i className="fa-solid fa-tags"></i> Quản lý sản phẩm </Link></li>
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
                        <h2>Quản lý sản phẩm</h2>
                    </div>
                    <div className="admin_product_article_box_content_bang">
                        <div className="admin_product_article_box_content_bang_box_btn">
                            <div className="btn_add" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo">
                                <button>Thêm sản phẩm</button>
                            </div>
                        </div>
                        <hr />
                        <div className="so" style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                            Hiện có <strong style={{ border: '1px Solid #d4cfcf', padding: '5px' }} id="soSP">{adminListSP.length}</strong> sản phẩm <i style={{ fontSize: '20px' }} className="fa-solid fa-caret-down"></i>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <label>Số sản phẩm mỗi trang:</label>
                                <select 
                                    value={itemsPerPage} 
                                    onChange={handleItemsPerPageChange}
                                    style={{ padding: '5px', borderRadius: '4px' }}
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                            </div>
                        </div>
                        <table className="admin_product_article_box_content_bang_table">
                            <thead>
                                <tr>
                                    <th>Hình</th>
                                    <th>Mã</th>
                                    <th style={{ width: '30%' }}>Tên sản phẩm</th>
                                    <th>Giá</th>
                                    <th>Loại</th>
                                    <th>Ram</th>
                                    <th>Cpu</th>
                                    <th>Ngày</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((sp, index) => (
                                    <tr key={index} style={{ height: '100px', borderBottom: '1px solid #d4cfcf', background: '#fff' }}>
                                        <td><img src={sp.hinh} alt={sp.hinh} style={{ width: '65px', height: '60px' }} /></td>
                                        <td style={{ fontWeight: "600" }}>{sp.id}</td>
                                        <td style={{ fontWeight: "600", padding: '10px' }}>{sp.ten_sp}</td>
                                        <td style={{ fontWeight: "600", color: 'red' }}>{parseFloat(sp.gia_km).toLocaleString("vi")} VNĐ</td>
                                        <td style={{ fontWeight: "600" }}>{sp.ten_loai}</td>
                                        <td style={{ fontWeight: "600" }}>{sp.ram}</td>
                                        <td style={{ fontWeight: "600" }}>{sp.cpu}</td>
                                        <td style={{ fontWeight: "600" }}>{new Date(sp.ngay).toLocaleDateString('vi-VN')}</td>
                                        <td className="thao_tac">
                                            <button className="btn_thao_tac1" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal2" data-bs-whatever="@mdo" onClick={() => selectProduct(sp)}>Sửa</button>
                                            <button className="btn_thao_tac2" type="button" data-bs-toggle="modal" data-bs-target="#deleteConfirmModal" onClick={() => handleDeleteClick(sp)}>Xóa</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {/* Updated pagination section */}
                        <div className="pagination-container">
                            <div className="pagination-info">
                                <div className="total-items">
                                    <i className="fa-solid fa-list-ul"></i> Tổng số: {adminListSP.length} sản phẩm
                                </div>
                                <div className="items-per-page">
                                    <label>Hiển thị:</label>
                                    <select 
                                        value={itemsPerPage} 
                                        onChange={handleItemsPerPageChange}
                                    >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
                                    </select>
                                    <span className="pagination-info-text">
                                        {firstItemIndex}-{lastItemIndex} trên {adminListSP.length}
                                    </span>
                                </div>
                            </div>

                            <div className="pagination-controls">
                                <button 
                                    className="pagination-button nav-button"
                                    onClick={() => handlePageChange(1)}
                                    disabled={currentPage === 1}
                                >
                                    <i className="fas fa-angle-double-left"></i>
                                </button>
                                <button 
                                    className="pagination-button nav-button"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    <i className="fas fa-angle-left"></i>
                                </button>
                                
                                {getPageNumbers().map((pageNum, index) => (
                                    pageNum === '...' ? (
                                        <span key={index} className="pagination-button">...</span>
                                    ) : (
                                        <button
                                            key={index}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`pagination-button ${currentPage === pageNum ? 'active' : ''}`}
                                        >
                                            {pageNum}
                                        </button>
                                    )
                                ))}
                                
                                <button 
                                    className="pagination-button nav-button"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    <i className="fas fa-angle-right"></i>
                                </button>
                                <button 
                                    className="pagination-button nav-button"
                                    onClick={() => handlePageChange(totalPages)}
                                    disabled={currentPage === totalPages}
                                >
                                    <i className="fas fa-angle-double-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
            <div className="modal fade" id="deleteConfirmModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Xác nhận xóa</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {selectedProduct && (
                                <p>Bạn chắc chắn muốn xóa sản phẩm "{selectedProduct.ten_sp}"?</p>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                            <button type="button" className="btn btn-danger" onClick={handleConfirmDelete} data-bs-dismiss="modal">Xóa</button>
                        </div>
                    </div>
                </div>
            </div>
            <AdminProductThem setRefresh={setRefresh} adminListSP={adminListSP} />
            <AdminProductSua setRefresh={setRefresh} selectedProduct={selectedProduct} />
        </div>
    );
}

export default AdminProduct;
