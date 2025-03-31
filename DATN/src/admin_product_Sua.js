import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from 'moment';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { showNotification } from './components/NotificationContainer';

function AdminProductSua({ setRefresh, selectedProduct }) {
    const [sp, setSp] = useState({ 
        ten_sp: '', hinh: '', gia_km: '', gia: '', ngay: '', luot_xem: '', id_loai: 0, ram: '', cpu: '', dia_cung: '', mau_sac: '', can_nang: '' 
    });

    useEffect(() => {
        if (selectedProduct) {
            setSp(selectedProduct);
        }
    }, [selectedProduct]);

    const navigate = useNavigate();

    const xuliInput = (e) => {
        const { id, value } = e.target;
        setSp(prev => ({ ...prev, [id]: value }));
    };

    const xuliid_loai = (e) => {
        setSp(prev => ({ ...prev, id_loai: parseInt(e.target.value, 10) }));
    };

    const submitDuLieu = async () => {
        try {
            const url = `http://localhost:3000/admin/sp/${sp.id}`;
            const duLieuGui = {
                ...sp,
                ngay: sp.ngay ? moment(sp.ngay).format('YYYY-MM-DD') : null
            };
            
            const response = await fetch(url, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(duLieuGui)
            });
            
            const data = await response.json();
            
            if (data.error) {
                showNotification({
                    type: 'error',
                    title: 'Lỗi',
                    message: data.error
                });
                return;
            }

            showNotification({
                type: 'success',
                title: 'Thành công',
                message: data.thongbao
            });
            setRefresh(prev => !prev);
            
            // Đóng modal
            const closeButton = document.querySelector('#exampleModal2 .btn-close');
            if (closeButton) {
                closeButton.click();
            }

            // Reset form
            setSp({ 
                ten_sp: '', hinh: '', gia_km: '', gia: '', ngay: '', luot_xem: '', 
                id_loai: 0, ram: '', cpu: '', dia_cung: '', mau_sac: '', can_nang: '' 
            });

        } catch (error) {
            console.error("Lỗi khi cập nhật sản phẩm:", error);
            showNotification({
                type: 'error',
                title: 'Lỗi',
                message: 'Có lỗi xảy ra khi cập nhật sản phẩm'
            });
        }
    };

    return (
        <div className="modal fade" id="exampleModal2" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-xl">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel" style={{ fontWeight: '600', color: "black" }}>Sửa sản phẩm</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body" style={{ marginTop: '-50px' }}>
                        <form style={{ display: "grid", gridTemplateColumns: "50% 50%" }}>
                            <div style={{ margin: '10px' }}>
                                <div className="mb-3">
                                    <label htmlFor="ten_sp" className="col-form-label">Tên sản phẩm</label>
                                    <input type="text" className="form-control" id="ten_sp" value={sp.ten_sp || ''} onChange={xuliInput} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="hinh" className="col-form-label">Hình ảnh</label>
                                    <input type="text" className="form-control" id="hinh" value={sp.hinh || ''} onChange={xuliInput} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="gia_km" className="col-form-label">Giá khuyến mãi</label>
                                    <input type="number" className="form-control" id="gia_km" value={sp.gia_km || ''} onChange={xuliInput} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="gia" className="col-form-label">Giá gốc</label>
                                    <input type="number" className="form-control" id="gia" value={sp.gia || ''} onChange={xuliInput} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="ngay" className="col-form-label">Ngày nhập</label>
                                    <input type="date" className="form-control" id="ngay" 
                                        value={sp.ngay ? moment(sp.ngay).format('YYYY-MM-DD') : ''} 
                                        onChange={xuliInput} 
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="luot_xem" className="col-form-label">Xem</label>
                                    <input type="number" className="form-control" id="luot_xem" value={sp.luot_xem || ''} onChange={xuliInput} />
                                </div>
                            </div>
                            <div style={{ margin: '10px' }}>
                                <div className="mb-3">
                                    <label htmlFor="id_loai" className="col-form-label">Loại sản phẩm</label>
                                    <select 
                                        style={{ width: '100%', padding: '9px', borderRadius: '5px', border: '1px solid rgb(230, 230, 230)', fontSize: '15px' }} 
                                        value={sp.id_loai || 0} 
                                        onChange={xuliid_loai} 
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
                                    <input type="text" className="form-control" id="ram" value={sp.ram || ''} onChange={xuliInput} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="cpu" className="col-form-label">CPU</label>
                                    <input type="text" className="form-control" id="cpu" value={sp.cpu || ''} onChange={xuliInput} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="dia_cung" className="col-form-label">Đĩa cứng</label>
                                    <input type="text" className="form-control" id="dia_cung" value={sp.dia_cung || ''} onChange={xuliInput} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="mau_sac" className="col-form-label">Màu sắc</label>
                                    <input type="text" className="form-control" id="mau_sac" value={sp.mau_sac || ''} onChange={xuliInput} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="can_nang" className="col-form-label">Cân nặng</label>
                                    <input type="text" className="form-control" id="can_nang" value={sp.can_nang || ''} onChange={xuliInput} />
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" style={{backgroundColor: '#6c757d'}} className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                        <button type="button" style={{backgroundColor: '#0d6efd'}} className="btn btn-primary" onClick={submitDuLieu}>Xác nhận</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminProductSua;
