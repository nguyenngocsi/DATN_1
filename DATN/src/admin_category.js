import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { thoat } from './authSlice';
import { useEffect, useState } from "react";
import AdminCategoryThem from "./admin_category_Them";
import AdminCategorySua from "./admin_category_Sua";
import './admin.css';
import { showNotification } from './components/NotificationContainer';

function AdminCategory() {
    document.title = "Quản lý Danh mục";
    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [category, setCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("http://localhost:3000/admin/category");
                const data = await response.json();
                setCategory(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching categories:", error);
                setLoading(false);
            }
        };
        fetchCategories();
    }, [refresh]);

    const xoaDM = async (id) => {
        if (!window.confirm('Bạn muốn xóa danh mục này?')) return;

        try {
            const response = await fetch(`http://localhost:3000/admin/category/${id}`, { 
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            showNotification({
                type: data.error ? 'error' : 'success',
                title: data.error ? 'Lỗi' : 'Thành công',
                message: data.thongbao
            });
            setRefresh(prev => !prev);
        } catch (error) {
            console.error("Lỗi khi xóa danh mục:", error);
            showNotification({
                type: 'error',
                title: 'Lỗi',
                message: 'Có lỗi xảy ra khi xóa danh mục'
            });
        }
    };

    const suaDM = (item) => {
        setSelectedCategory(item);
    };

    const Logout = () => {
        if (window.confirm('Bạn muốn đăng xuất?')) {
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
                        <h2>Quản lý Danh mục</h2>
                    </div>
                    <div className="admin_product_article_box_content_bang">
                        <div className="admin_product_article_box_content_bang_box_btn">
                            <div className="btn_add" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo">
                                <button>Thêm danh mục</button>
                            </div>
                        </div>
                        <hr />
                        <table className="admin_product_article_box_content_bang_table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tên Danh Mục</th>
                                    <th>Hình Ảnh</th>
                                    <th>Slug</th>
                                    <th>Thứ Tự</th>
                                    <th>Trạng Thái</th>
                                    <th>Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {category.map((item) => (
                                    <tr key={item.id} style={{ height: '100px', borderBottom: '1px solid #d4cfcf', background: '#fff' }}>
                                        <td>{item.id}</td>
                                        <td>{item.ten_loai}</td>
                                        <td>
                                            <img
                                                src={item.img_loai}
                                                alt={item.ten_loai}
                                                style={{ width: '65px', height: '60px' }}
                                            />
                                        </td>
                                        <td>{item.slug}</td>
                                        <td>{item.thu_tu}</td>
                                        <td>
                                            <span className={item.an_hien === 1 ? 'active' : 'inactive'}>
                                                {item.an_hien === 1 ? "Hiện" : "Ẩn"}
                                            </span>
                                        </td>
                                        <td className="thao_tac">
                                            <button 
                                                className="btn_thao_tac1" 
                                                data-bs-toggle="modal" 
                                                data-bs-target="#exampleModal2" 
                                                data-bs-whatever="@mdo"
                                                onClick={() => suaDM(item)}
                                            >
                                                Sửa
                                            </button>
                                            <button 
                                                className="btn_thao_tac2" 
                                                onClick={() => xoaDM(item.id)}
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </article>
            <AdminCategoryThem setRefresh={setRefresh} />
            <AdminCategorySua 
                setRefresh={setRefresh} 
                category={selectedCategory} 
                setSelectedCategory={setSelectedCategory}
            />
        </div>
    );
}

export default AdminCategory;
