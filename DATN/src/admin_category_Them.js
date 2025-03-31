import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './admin.css';
import { showNotification } from './components/NotificationContainer';

function AdminCategoryThem({ setRefresh }) {
    const [loai, setUs] = useState({
        ten_loai: '',
        img_loai: '',
        slug: '',
        thu_tu: '',
        an_hien: 1 // Default to "Hiện"
    });

    const navigate = useNavigate();
    const [thongBao, setThongBao] = useState(false);

    const xuliInput = (e) => {
        const { id, value } = e.target;
        setUs(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const xuliRadio = (e) => {
        const { value } = e.target;
        setUs(prev => ({
            ...prev,
            an_hien: parseInt(value)
        }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!loai.ten_loai || !loai.img_loai) {
            showNotification({
                type: 'error',
                title: 'Lỗi',
                message: 'Vui lòng nhập đầy đủ thông tin tên danh mục và hình ảnh!'
            });
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/admin/category', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loai)
            });

            const data = await response.json();
            showNotification({
                type: data.error ? 'error' : 'success',
                title: data.error ? 'Lỗi' : 'Thành công',
                message: data.thongbao || "Thêm danh mục thành công!"
            });

            if (!data.error) {
                setUs({
                    ten_loai: '',
                    img_loai: '',
                    slug: '',
                    thu_tu: '',
                    an_hien: 1 // Reset to default "Hiện"
                });
                setRefresh(prev => !prev);
                // Đóng modal
                const closeButton = document.querySelector('#exampleModal .btn-close');
                if (closeButton) {
                    closeButton.click();
                }
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification({
                type: 'error',
                title: 'Lỗi',
                message: 'Có lỗi xảy ra khi thêm danh mục!'
            });
        }
    };

    return (
        <>
            <div className="notification-container">
                {thongBao && (
                    <div className="notification success">
                        <i className="fas fa-check-circle"></i> Danh mục đã được thêm thành công!
                    </div>
                )}
            </div>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Thêm Danh Mục</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="ten_loai" className="col-form-label">Tên danh mục:</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="ten_loai" 
                                    value={loai.ten_loai} 
                                    onChange={xuliInput} 
                                    placeholder="Nhập tên danh mục"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="img_loai" className="col-form-label">Hình ảnh:</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="img_loai" 
                                    value={loai.img_loai} 
                                    onChange={xuliInput} 
                                    placeholder="Nhập URL hình ảnh"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="slug" className="col-form-label">Slug:</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="slug" 
                                    value={loai.slug} 
                                    onChange={xuliInput} 
                                    placeholder="Nhập slug"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="thu_tu" className="col-form-label">Thứ tự:</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    id="thu_tu" 
                                    value={loai.thu_tu} 
                                    onChange={xuliInput} 
                                    placeholder="Nhập thứ tự hiển thị"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="col-form-label d-block">Trạng thái:</label>
                                <div className="form-check form-check-inline">
                                    <input 
                                        className="form-check-input" 
                                        type="radio" 
                                        name="an_hien" 
                                        id="hien" 
                                        value="1" 
                                        checked={loai.an_hien === 1} 
                                        onChange={xuliRadio} 
                                    />
                                    <label className="form-check-label" htmlFor="hien">Hiện</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input 
                                        className="form-check-input" 
                                        type="radio" 
                                        name="an_hien" 
                                        id="an" 
                                        value="0" 
                                        checked={loai.an_hien === 0} 
                                        onChange={xuliRadio} 
                                    />
                                    <label className="form-check-label" htmlFor="an">Ẩn</label>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                            <button type="button" className="btn btn-primary" onClick={handleSubmit}>Xác nhận</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminCategoryThem;
