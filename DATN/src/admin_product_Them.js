import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showNotification } from './components/NotificationContainer';

function AdminProductThem({ setRefresh, adminListSP }) {
    const [sp, setSp] = useState({
        ten_sp: '',
        hinh: '',
        gia_km: '0',
        gia: '0',
        ngay: new Date().toISOString().split('T')[0],
        luot_xem: '0',
        id_loai: 0,
        ram: '',
        cpu: '',
        dia_cung: '',
        mau_sac: '',
        can_nang: ''
    });

    const navigate = useNavigate();

    const getNextId = () => {
        if (!adminListSP || adminListSP.length === 0) return 1;
        
        // Lọc và chuyển đổi các ID hợp lệ
        const validIds = adminListSP
            .map(item => parseInt(item.id))
            .filter(id => !isNaN(id) && id > 0); // Chỉ lấy ID > 0
        
        if (validIds.length === 0) return 1;
        
        // Lấy ID lớn nhất và cộng 1
        const maxId = Math.max(...validIds);
        console.log('Current max ID:', maxId);
        const nextId = maxId + 1;
        console.log('Next ID will be:', nextId);
        return nextId;
    };

    const xuliInput = (e) => {
        const { id, value } = e.target;
        setSp(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const xuliid_loai = (e) => {
        setSp(prev => ({
            ...prev,
            id_loai: parseInt(e.target.value, 10)
        }));
    };

    const closeModal = () => {
        const modal = document.getElementById('exampleModal');
        const modalBackdrop = document.querySelector('.modal-backdrop');
        
        if (modal) {
            modal.classList.remove('show');
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
        
        if (modalBackdrop) {
            modalBackdrop.remove();
        }
    };

    const resetForm = () => {
        setSp({
            ten_sp: '',
            hinh: '',
            gia_km: '0',
            gia: '0',
            ngay: new Date().toISOString().split('T')[0],
            luot_xem: '0',
            id_loai: 0,
            ram: '',
            cpu: '',
            dia_cung: '',
            mau_sac: '',
            can_nang: ''
        });
    };

    const submitDuLieu = async (e) => {
        e.preventDefault();
        
        // Validate required fields
        if (!sp.ten_sp.trim()) {
            showNotification({
                type: 'error',
                title: 'Lỗi',
                message: 'Vui lòng nhập tên sản phẩm'
            });
            return;
        }

        if (sp.id_loai === 0) {
            showNotification({
                type: 'error',
                title: 'Lỗi',
                message: 'Vui lòng chọn loại sản phẩm'
            });
            return;
        }

        if (!sp.gia || parseFloat(sp.gia) <= 0) {
            showNotification({
                type: 'error',
                title: 'Lỗi',
                message: 'Vui lòng nhập giá hợp lệ'
            });
            return;
        }

        const nextId = getNextId();
        console.log('Generated next ID:', nextId);

        if (nextId <= 0) {
            showNotification({
                type: 'error',
                title: 'Lỗi',
                message: 'Không thể tạo ID hợp lệ cho sản phẩm'
            });
            return;
        }

        // Format data before sending
        const productData = {
            ...sp,
            id: nextId,
            gia: parseFloat(sp.gia),
            gia_km: parseFloat(sp.gia_km) || parseFloat(sp.gia),
            luot_xem: parseInt(sp.luot_xem) || 0,
            ngay: sp.ngay || new Date().toISOString().split('T')[0]
        };

        console.log('Sending product data:', productData);

        try {
            const response = await fetch('http://localhost:3000/admin/sp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });

            console.log('Response status:', response.status);
            const responseData = await response.json();
            console.log('Response data:', responseData);

            if (!response.ok || responseData.error) {
                throw new Error(responseData.thongbao || 'Có lỗi xảy ra khi thêm sản phẩm');
            }

            showNotification({
                type: 'success',
                title: 'Thành công',
                message: 'Thêm sản phẩm thành công'
            });

            resetForm();
            setRefresh(prev => !prev);
            closeModal();
            
        } catch (error) {
            console.error('Error details:', error);
            showNotification({
                type: 'error',
                title: 'Lỗi',
                message: error.message || 'Có lỗi xảy ra khi thêm sản phẩm'
            });
        }
    };

    return (
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-xl">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel" style={{ fontWeight: '600', color: "black" }}>Thêm sản phẩm</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={submitDuLieu} style={{ display: "grid", gridTemplateColumns: "50% 50%" }}>
                            <div style={{ margin: '10px' }}>
                                <div className="mb-3">
                                    <label htmlFor="ten_sp" className="col-form-label">Tên sản phẩm <span className="text-danger">*</span></label>
                                    <input type="text" className="form-control" id="ten_sp" value={sp.ten_sp} onChange={xuliInput} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="hinh" className="col-form-label">Hình ảnh</label>
                                    <input type="text" className="form-control" id="hinh" value={sp.hinh} onChange={xuliInput} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="gia_km" className="col-form-label">Giá khuyến mãi</label>
                                    <input type="number" className="form-control" id="gia_km" value={sp.gia_km} onChange={xuliInput} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="gia" className="col-form-label">Giá gốc</label>
                                    <input type="number" className="form-control" id="gia" value={sp.gia} onChange={xuliInput} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="ngay" className="col-form-label">Ngày nhập</label>
                                    <input type="date" className="form-control" id="ngay" value={sp.ngay} onChange={xuliInput} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="luot_xem" className="col-form-label">Lượt xem</label>
                                    <input type="number" className="form-control" id="luot_xem" value={sp.luot_xem} onChange={xuliInput} />
                                </div>
                            </div>
                            <div style={{ margin: '10px' }}>
                                <div className="mb-3">
                                    <label htmlFor="id_loai" className="col-form-label">Loại sản phẩm <span className="text-danger">*</span></label>
                                    <select 
                                        className="form-select"
                                        value={sp.id_loai}
                                        onChange={xuliid_loai}
                                        required
                                    >
                                        <option value={0}>Chọn loại sản phẩm</option>
                                        <option value={1}>Asus</option>
                                        <option value={2}>Acer</option>
                                        <option value={3}>Lenovo</option>
                                        <option value={4}>MSI</option>
                                        <option value={5}>HP</option>
                                        <option value={6}>Dell</option>
                                        <option value={7}>Apple</option>
                                        <option value={8}>Surface</option>
                                        <option value={9}>Masstel</option>
                                        <option value={10}>LG</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="ram" className="col-form-label">Ram</label>
                                    <input type="text" className="form-control" id="ram" value={sp.ram} onChange={xuliInput} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="cpu" className="col-form-label">CPU</label>
                                    <input type="text" className="form-control" id="cpu" value={sp.cpu} onChange={xuliInput} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="dia_cung" className="col-form-label">Đĩa cứng</label>
                                    <input type="text" className="form-control" id="dia_cung" value={sp.dia_cung} onChange={xuliInput} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="mau_sac" className="col-form-label">Màu sắc</label>
                                    <input type="text" className="form-control" id="mau_sac" value={sp.mau_sac} onChange={xuliInput} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="can_nang" className="col-form-label">Cân nặng</label>
                                    <input type="text" className="form-control" id="can_nang" value={sp.can_nang} onChange={xuliInput} />
                                </div>
                            </div>
                            <div className="modal-footer" style={{ gridColumn: "1 / -1" }}>
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                <button type="submit" className="btn btn-primary">Xác nhận</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminProductThem;
