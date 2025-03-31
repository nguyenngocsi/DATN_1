import { useState, useEffect } from "react";
import { showNotification } from './components/NotificationContainer';

function AdminCategoryEdit({ loai, setRefresh }) {
    const [editedLoai, setEditedLoai] = useState({
        id: "",
        ten_loai: "",
        img_loai: "",
        slug: "",
        thu_tu: "",
        an_hien: 1
    });
    const [thongBao, setThongBao] = useState(false);

    useEffect(() => {
        if (loai) {
            setEditedLoai({
                id: loai.id,
                ten_loai: loai.ten_loai,
                img_loai: loai.img_loai,
                slug: loai.slug,
                thu_tu: loai.thu_tu,
                an_hien: loai.an_hien
            });
        }
    }, [loai]);

    const xuliInput = (e) => {
        const { id, value } = e.target;
        setEditedLoai(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const xuliRadio = (e) => {
        const { value } = e.target;
        setEditedLoai(prev => ({
            ...prev,
            an_hien: parseInt(value)
        }));
    };

    const submitDuLieu = () => {
        // Kiểm tra dữ liệu đầu vào
        if (!editedLoai.ten_loai || !editedLoai.img_loai) {
            showNotification({
                type: 'error',
                title: 'Lỗi',
                message: 'Vui lòng nhập đầy đủ thông tin tên danh mục và hình ảnh!'
            });
            return;
        }
        
        const url = `http://localhost:3000/admin/category/${editedLoai.id}`;
        const options = {
            method: "PUT",
            body: JSON.stringify(editedLoai),
            headers: { 'Content-Type': 'application/json' }
        };
        
        fetch(url, options)
            .then(res => res.json())
            .then(data => {
                showNotification({
                    type: 'success',
                    title: 'Thành công',
                    message: data.thongbao || "Cập nhật danh mục thành công!"
                });
                
                // Hiển thị thông báo
                setThongBao(true);
                setTimeout(() => {
                    setThongBao(false);
                }, 2000);
                
                // Đóng modal
                const closeButton = document.querySelector('#editModal .btn-close');
                if (closeButton) closeButton.click();
                
                // Refresh danh sách
                setRefresh(prev => !prev);
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification({
                    type: 'error',
                    title: 'Lỗi',
                    message: 'Có lỗi xảy ra khi cập nhật danh mục!'
                });
            });
    };

    return (
        <>
            {thongBao && (
                <div className="thongbao">
                    Danh mục đã được cập nhật thành công!
                </div>
            )}
            <div className="modal fade" id="editModal" tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="editModalLabel">Sửa Danh Mục</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="ten_loai" className="col-form-label">Tên danh mục:</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="ten_loai" 
                                    value={editedLoai.ten_loai} 
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
                                    value={editedLoai.img_loai} 
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
                                    value={editedLoai.slug} 
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
                                    value={editedLoai.thu_tu} 
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
                                        checked={editedLoai.an_hien === 1} 
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
                                        checked={editedLoai.an_hien === 0} 
                                        onChange={xuliRadio} 
                                    />
                                    <label className="form-check-label" htmlFor="an">Ẩn</label>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                            <button type="button" className="btn btn-primary" onClick={submitDuLieu}>Cập Nhật</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminCategoryEdit; 