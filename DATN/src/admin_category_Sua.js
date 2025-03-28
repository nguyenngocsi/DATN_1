// admin_category_Sua.js
import { useState, useEffect } from "react";
import './admin.css';

function AdminCategorySua({ setRefresh, category }) {
    const [loai, setLoai] = useState({
        ten_loai: '',
        img_loai: '',
        slug: '',
        thu_tu: '',
        an_hien: 1
    });

    useEffect(() => {
        if (category) setLoai(category);
    }, [category]);

    const xuliInput = (e) => {
        const { id, value } = e.target;
        setLoai(prev => ({ ...prev, [id]: value }));
    };

    const xuliRadio = (e) => {
        setLoai(prev => ({ ...prev, an_hien: parseInt(e.target.value) }));
    };

    const submitDuLieu = () => {
        fetch(`http://localhost:3000/admin/category/${loai.id}`, {
            method: "PUT",
            body: JSON.stringify(loai),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.json())
            .then(data => {
                alert(data.thongbao);
                setRefresh(prev => !prev);
            });
            setThongBao(true);
            setTimeout(() => {
            setThongBao(false);
        }, 2000);
    };
    const [thongBao, setThongBao] = useState(false);

    return (
        <div>
            <div className="notification-container">
                {thongBao && (
                    <div className="notification success">
                        <i className="fas fa-check-circle"></i> Sửa danh mục thành công!
                    </div>
                )}
            </div>
            <div className="modal fade" id="editModal" tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="editModalLabel">Sửa Danh Mục</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label htmlFor="ten_loai" className="form-label">Tên danh mục:</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="ten_loai" 
                                    value={loai.ten_loai} 
                                    onChange={xuliInput} 
                                    placeholder="Nhập tên danh mục"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="img_loai" className="form-label">Hình ảnh:</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="img_loai" 
                                    value={loai.img_loai} 
                                    onChange={xuliInput} 
                                    placeholder="Nhập URL hình ảnh"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="slug" className="form-label">Slug:</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="slug" 
                                    value={loai.slug} 
                                    onChange={xuliInput} 
                                    placeholder="Nhập slug"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="thu_tu" className="form-label">Thứ tự:</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    id="thu_tu" 
                                    value={loai.thu_tu} 
                                    onChange={xuliInput} 
                                    placeholder="Nhập thứ tự"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Trạng thái:</label>
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
                            <button type="button" className="btn btn-primary" onClick={submitDuLieu}>Xác nhận</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminCategorySua;