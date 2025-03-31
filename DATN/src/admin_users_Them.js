import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showNotification } from './components/NotificationContainer';

function AdminUsersThem({ setRefresh }) {
    const [us, setUs] = useState({
        name: '',
        email: '',
        password: '',
        dia_chi: '',
        dien_thoai: '',
        hinh: '',
        role: 0
    });

    const navigate = useNavigate();

    const xuliInput = (e) => {
        const { id, value } = e.target;
        setUs(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const submitDuLieu = () => {
        let url = `http://localhost:3000/admin/users`;
        let otp = {
            method: "post",
            body: JSON.stringify(us),
            headers: { 'Content-Type': 'application/json' }
        }
        fetch(url, otp)
            .then(res => res.json())
            .then(data => {
                showNotification({
                    type: data.error ? 'error' : 'success',
                    title: data.error ? 'Lỗi' : 'Thành công',
                    message: data.thongbao
                });
                setUs({
                    name: '',
                    email: '',
                    password: '',
                    dia_chi: '',
                    dien_thoai: '',
                    hinh: '',
                    role: 0
                });
                setRefresh(prev => !prev);
                navigate('/admin/user');
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification({
                    type: 'error',
                    title: 'Lỗi',
                    message: 'Có lỗi xảy ra khi thêm tài khoản'
                });
            });
    };

    return (
           <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" >
            <div className="modal-dialog modal-xl">
                <div className="modal-content" style={{height:'680px'}}>
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel" style={{ fontWeight: '600', color: "black" }}>Thêm tài khoản</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body" style={{ marginTop: '-80px' }}>
                        <form style={{ display: "grid", gridTemplateColumns: "50% 50%" }}>
                            <div style={{ margin: '10px' }}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="col-form-label">Tên tài khoản</label>
                                    <input type="text" className="form-control" id="name" value={us.name} onChange={xuliInput} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="hinh" className="col-form-label">Avatar</label>
                                    <input type="text" className="form-control" id="hinh" value={us.hinh} onChange={xuliInput} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="col-form-label">Email</label>
                                    <input type="text" className="form-control" id="email" value={us.email} onChange={xuliInput} />
                                </div>
                            </div>
                            <div style={{ margin: '10px' }}>
                                <div className="mb-3">
                                    <label htmlFor="password" className="col-form-label">Mật khẩu</label>
                                    <input type="text" className="form-control" id="password" value={us.password} onChange={xuliInput} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="dia_chi" className="col-form-label">Địa chỉ</label>
                                    <input type="text" className="form-control" id="dia_chi" value={us.dia_chi} onChange={xuliInput} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="dien_thoai" className="col-form-label">Số điện thoại</label>
                                    <input type="number" className="form-control" id="dien_thoai" value={us.dien_thoai} onChange={xuliInput} />
                                </div>
                            </div>
                            <div className="mb-3" style={{ marginTop: '-48vh',marginLeft:'10px' }}>
                                <label htmlFor="role" className="col-form-label">Vai trò</label>
                                <select style={{ width: '200%', padding: '9px', borderRadius: '5px', border: '1px solid rgb(230, 230, 230)', fontSize: '15px' }} id="role" value={us.role} onChange={xuliInput}>
                                    <option value={-1}>Chọn vai trò:</option>
                                    <option value={0}>Khách hàng</option>
                                    <option value={1}>Admin</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer" style={{transform:'translateY(-150px)'}}>
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                        <button type="button" className="btn btn-primary" onClick={submitDuLieu}>Xác nhận</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminUsersThem;
