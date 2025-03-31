import React, { useState, useEffect } from "react";
import HienSPTrongMotTrang from './HienSPTrongMotTrang'; // Đảm bảo đường dẫn đúng
import Danhmuc from "./danhmuc";
import { Link, useNavigate } from "react-router-dom";
import { themVaoSoSanh, xoaKhoiSoSanh } from './compareSlice'; // Thêm xoaKhoiSoSanh nếu có
import { useDispatch, useSelector } from 'react-redux';
import { themSP } from './cartSlice';
import './home_sosanh.css';
import './boxPro.css';
import './App.css';
function Laptop() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const daDangNhap = useSelector(state => state.auth.daDangNhap);
    const [listsp, ganListSP] = useState([]);
    const [originalListsp, setOriginalListsp] = useState([]);
    const danhSachSoSanh = useSelector(state => state.compare.danhSachSoSanh); // Lấy từ Redux
    const [isCompareBoxVisible, setIsCompareBoxVisible] = useState(false);
    const [thongBao, setThongBao] = useState(false);
    const [daSapXep, setDaSapXep] = useState(false);

    useEffect(() => {
        fetch("http://localhost:3000/sp")
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) {
                ganListSP(data);
                setOriginalListsp(data);
            } else {
                ganListSP([]);
                setOriginalListsp([]);
            }
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            ganListSP([]);
            setOriginalListsp([]);
        });
    }, []);
    useEffect(() => {
        const isVisible = localStorage.getItem('isCompareBoxVisible') === 'true';
        setIsCompareBoxVisible(isVisible);
    }, []);
    const sapXepGiaTang = () => {
        if (!Array.isArray(listsp)) return;
        
        const sx = [...listsp].sort((a, b) => {
            const giaA = parseFloat(a.gia_km || a.gia);
            const giaB = parseFloat(b.gia_km || b.gia);
            return giaA - giaB;
        });
        ganListSP(sx);
        setDaSapXep(true);
    };

    const sapXepGiaGiam = () => {
        if (!Array.isArray(listsp)) return;
        
        const sx = [...listsp].sort((a, b) => {
            const giaA = parseFloat(a.gia_km || a.gia);
            const giaB = parseFloat(b.gia_km || b.gia);
            return giaB - giaA;
        });
        ganListSP(sx);
        setDaSapXep(true);
    };
    
    const sapXepTheoLuotXem = () => {
        if (!Array.isArray(listsp)) return;
        
        const sx = [...listsp].sort((a, b) => {
            return b.luot_xem - a.luot_xem;
        });
        ganListSP(sx);
        setDaSapXep(true);
    };
    
    const huyBoClocVaSapXep = () => {
        ganListSP([...originalListsp]);
        setDaSapXep(false);
    };

    const xuli = (sanpham) => {
        if (!daDangNhap) {
            if (window.confirm("Đăng nhập để thêm sản phẩm vào giỏ hàng!")) {
                navigate('/login');
                return;
            }
        }
        dispatch(themSP(sanpham));
        setThongBao(true);
        setTimeout(() => {
            setThongBao(false);
        }, 2000);
    };

    const themSoSanhVaChuyenTrang = (sanpham) => {
        if (danhSachSoSanh.length >= 3) {
            alert("Bạn chỉ có thể so sánh tối đa 3 sản phẩm!");
            return;
        }
        console.log("🔍 Sản phẩm thêm vào so sánh:", sanpham);
        dispatch(themVaoSoSanh(sanpham)); // Dispatch action để thêm vào Redux
        setThongBao(true);
        setTimeout(() => {
            setThongBao(false);
            showCompareBox();
        }, 1000);
    };

    const clearCompare = () => {
        // Xóa tất cả sản phẩm khỏi Redux (giả sử có action xoaKhoiSoSanh)
        danhSachSoSanh.forEach(sp => dispatch(xoaKhoiSoSanh(sp.id)));
        setIsCompareBoxVisible(false);
        localStorage.setItem('isCompareBoxVisible', 'false');
    };

    const showCompareBox = () => {
        setIsCompareBoxVisible(true);
        localStorage.setItem('isCompareBoxVisible', 'true');
    };

    const handleCompareNow = () => {
        navigate('/so-sanh');
    };

    const handleScrollToTop = (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    return (
        <div>
            {thongBao && (
                <div className="thongbao">
                    Sản phẩm đã được thêm vào so sánh!
                </div>
            )}
            <div><Danhmuc/></div>
            <div className="box_chucnang_loc_home">
                    <label style={{ marginRight: '5px', padding: '5px', fontWeight: '700', fontSize: '15px' }}>Sắp xếp: </label>
                    <select style={{ width: '220px', padding: '3px', borderRadius: '2px', border: '1px solid gray', fontSize: '15px' }}
                        onChange={(e) => { 
                            const value = e.target.value;
                            if (value === '1') {
                                huyBoClocVaSapXep();
                            } else if (value === '2') { 
                                sapXepGiaTang(); 
                            } else if (value === '3') { 
                                sapXepGiaGiam(); 
                            } else if (value === '4') {
                                sapXepTheoLuotXem();
                            }
                        }}>
                        <option value={1}>Mặc định</option>
                        <option value={2}>Giá khuyến mãi thấp đến cao</option>
                        <option value={3}>Giá khuyến mãi cao đến thấp</option>
                        <option value={4}>Sản phẩm được quan tâm nhiều</option>
                    </select>
                </div>
            <HienSPTrongMotTrang spTrongTrang={listsp} />
            {isCompareBoxVisible && (
                <div className="stickcompare stickcompare_new cp-desktop spaceInDown">
                    <a href="javascript:;" onClick={clearCompare} className="clearall">
                        <i className="bi bi-x"></i>Thu gọn
                    </a>
                    <ul className="listcompare">
                        {danhSachSoSanh.map(sp => (
                            <li key={sp.id}>
                                <span className="remove-ic-compare" onClick={() => dispatch(xoaKhoiSoSanh(sp.id))}>
                                    <i className="bi bi-x"></i>
                                </span>
                                <img src={sp.hinh} alt={sp.ten_sp} />
                                <h3>{sp.ten_sp}</h3>
                                <div className="product-info">
                                    <div>RAM: {sp.ram}</div>
                                    <div>SSD: {sp.dia_cung}</div>
                                    <div className="price">{parseFloat(sp.gia_km).toLocaleString("vi")}₫</div>
                                </div>
                            </li>
                        ))}
                        {danhSachSoSanh.length < 3 && (
                            <li className="formsg">
                                <div className="cp-plus cp-plus_new">
                                    <i className="bi bi-plus-lg"></i>
                                    <p>Thêm sản phẩm</p>
                                </div>
                            </li>
                        )}
                    </ul>
                    <div className="closecompare">
                        <a href="javascript:;" onClick={handleCompareNow} className="doss">
                            So sánh ngay
                        </a>
                        <a href="javascript:;" onClick={clearCompare} className="txtremoveall">
                            Xóa tất cả
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Laptop;