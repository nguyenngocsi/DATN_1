import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import banner_n1 from './img/banner_n1.webp';
import banner5 from './img/banner5.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { themSP } from './cartSlice';
import { themVaoSoSanh, xoaKhoiSoSanh } from './compareSlice';
import './home_sosanh.css';

function TitleH2() {
  return (
    <div className="titile_SP">
      {/* <h2>SẢN PHẨM HOT THÁNG 6</h2>
      <hr className="h_r"></hr> */}
    </div>
  );
}

function SPXemNhieu() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const daDangNhap = useSelector(state => state.auth.daDangNhap);
  const danhSachSoSanh = useSelector(state => state.compare.danhSachSoSanh);
  const [listsp, setListSP] = useState([]);
  const [sotin, setXemNhieu] = useState(12);
  const [daSapXep, setDaSapXep] = useState(false);
  const [thongBao, setThongBao] = useState(false);
  const [isCompareBoxVisible, setIsCompareBoxVisible] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/sphot")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setListSP(data);
        } else {
          setListSP([]);
        }
      })
      .catch(error => {
        console.error('Error fetching hot products:', error);
        setListSP([]);
      });
  }, []);

  useEffect(() => {
    const isVisible = localStorage.getItem('isCompareBoxVisible') === 'true';
    setIsCompareBoxVisible(isVisible);
  }, []);

  const showCompareBox = () => {
    setIsCompareBoxVisible(true);
    localStorage.setItem('isCompareBoxVisible', 'true');
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
    dispatch(themVaoSoSanh(sanpham));
    setThongBao(true);
    setTimeout(() => {
      setThongBao(false);
      showCompareBox();
    }, 1000);
  };

  const clearCompare = () => {
    danhSachSoSanh.forEach(sp => dispatch(xoaKhoiSoSanh(sp.id)));
    setIsCompareBoxVisible(false);
    localStorage.setItem('isCompareBoxVisible', 'false');
  };

  const handleCompareNow = () => {
    navigate('/so-sanh');
  };

  // Cài đặt cho slideshow ở giữa trang
  const slideSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  // Chuyển từ slider sang hiển thị grid như trong hình
  return (
    <div >
      {thongBao && (
        <div className="thongbao">
          Sản phẩm đã được thêm vào so sánh!
        </div>
      )}
      <div className="box_spxn">
        <TitleH2 />
        
        {/* Banner thu cũ lên đời */}
        <div style={{ 
          width: '100%', 
          backgroundColor: '#fce83a', 
          borderRadius: '5px',
          marginBottom: '20px',
          padding: '10px',
          textAlign: 'center',
          color: '#ff0000',
          fontSize: '24px',
          fontWeight: 'bold'
        }}>
          THU CŨ LÊN ĐỜI - TRỢ GIÁ ĐẾN 2 TRIỆU
        </div>
        <div className="tong_box_SP_XN">
          {Array.isArray(listsp) && listsp.map((sp, i) => (
            <div className="box_SP" key={i}>
              {sp.phan_tram_gg && (
                <div className="box_SP_khuyen_mai">
                  Giảm {sp.phan_tram_gg}%
                </div>
              )}
              <div className="box_SP_anh">
                <Link to={`/sanpham/${sp.id}/${sp.id_loai}`}>
                  <img src={sp.hinh} title={sp.ten_sp.toUpperCase()} alt={sp.ten_sp} />
                </Link>
              </div>
              <div className="cart_icon" onClick={() => xuli(sp)}>
                <i className="bi bi-bag-plus-fill"></i>
              </div>
              <div className="box_SP_tensp">
                <Link to={`/sanpham/${sp.id}/${sp.id_loai}`}>{sp.ten_sp}</Link>
              </div>
              <div className="box_SP_RAM_SSD">
                <div><button className="box_SP_RAM">RAM: {sp.ram}</button></div>
                <div><button className="box_SP_SSD">SSD: {sp.dia_cung}</button></div>
              </div>
              <div className="box_SP_gia">
                <div className="box_SP_gia_km" style={{color: '#ff0000', fontWeight: 'bold'}}>
                  {parseFloat(sp.gia_km).toLocaleString("vi")} VNĐ
                </div>
                <div className="box_SP_gia_goc" style={daSapXep ? {color: '#999'} : {}}>
                  <del>{parseFloat(sp.gia).toLocaleString("vi")} VNĐ</del>
                </div>
              </div>
              <div className="box_SP_luot_xem"><p>Lượt xem: {sp.luot_xem}</p></div>
              <div className="box_SP_icon">
                <div className="box_SP_icon_star">
                  <div className="box_SP_icon_star_dam"><i className="bi bi-star-fill"></i></div>
                  <div className="box_SP_icon_star_dam"><i className="bi bi-star-fill"></i></div>
                  <div className="box_SP_icon_star_dam"><i className="bi bi-star-fill"></i></div>
                  <div className="box_SP_icon_star_dam"><i className="bi bi-star-fill"></i></div>
                  <div className="box_SP_icon_star_nhat"><i className="bi bi-star-fill"></i></div>
                  <div className="box_SP_icon_star_dg"><p>(Đánh giá)</p></div>
                </div>
                <div className="so_sanh">
                  <button className="so_sanh_btn" onClick={() => themSoSanhVaChuyenTrang(sp)}>
                    So sánh
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Thêm slideshow ở đây */}
      <div style={{ marginTop: '30px', marginBottom: '30px' }}>
        <div className="titile_SP">
          <h2>SẢN PHẨM XEM NHIỀU</h2>
          <hr className="h_r"></hr>
        </div>
        
        <div className="slider-container" style={{ width: '100%', marginTop: '20px' }}>
          <Slider {...slideSettings}>
            {Array.isArray(listsp) && listsp
              .sort((a, b) => a.gia_km - b.gia_km) // Sắp xếp theo giá từ thấp đến cao
              .slice(0, 8)
              .map((sp, i) => (
                <div key={i} style={{ padding: '0 10px', position: 'relative' }}>
                  <div style={{ 
                    border: '1px solid #e8e8e8', 
                    borderRadius: '8px', 
                    padding: '15px', 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* Nhãn giảm giá */}
                    {sp.gia_km && sp.gia_km < sp.gia && (
                      <div style={{ 
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        background: '#ff0000',
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        zIndex: 3
                      }}>
                        Giảm {Math.round(((sp.gia - sp.gia_km) / sp.gia) * 100)}%
                      </div>
                    )}
                    
                    {/* Nút thêm vào giỏ hàng */}
                    <div style={{ 
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      zIndex: 3,
                      width: '30px',
                      height: '30px',
                      background: '#ffffff',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                    }} onClick={() => xuli(sp)}>
                      <i className="bi bi-bag-plus-fill" style={{ color: '#2196f3' }}></i>
                    </div>
                    
                    {/* Ảnh sản phẩm */}
                    <div style={{ 
                      height: '150px', 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '10px'
                    }}>
                      <Link to={`/sanpham/${sp.id}/${sp.id_loai}`}>
                        <img 
                          src={sp.hinh} 
                          alt={sp.ten_sp} 
                          style={{ 
                            maxWidth: '100%',
                            maxHeight: '130px',
                            objectFit: 'contain'
                          }} 
                        />
                      </Link>
                    </div>
                    
                    {/* Tên sản phẩm */}
                    <div style={{ 
                      fontSize: '14px',
                      fontWeight: 'bold',
                      height: '40px',
                      overflow: 'hidden',
                      marginBottom: '8px'
                    }}>
                      <Link to={`/sanpham/${sp.id}/${sp.id_loai}`} style={{ 
                        color: '#333',
                        textDecoration: 'none'
                      }}>
                        {sp.ten_sp}
                      </Link>
                    </div>
                    <div style={{
                      fontSize:"12px",
                    }}>
                      <i className="fa-solid fa-eye"></i> {sp.luot_xem}
                    </div>
                    {/* Giá */}
                    <div style={{ 
                      color: '#ff0000',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      marginBottom: '5px'
                    }}>
                      {parseFloat(sp.gia_km || sp.gia).toLocaleString("vi")}₫
                    </div>
                    
                    {/* Giá gốc */}
                    {sp.gia_km && sp.gia_km !== sp.gia && (
                      <div style={{ 
                        color: '#999',
                        fontSize: '12px',
                        textDecoration: 'line-through'
                      }}>
                        {parseFloat(sp.gia).toLocaleString("vi")}₫
                      </div>
                    )}
                    
                    {/* Nút so sánh */}
                    <div style={{ 
                      marginTop: '10px',
                      textAlign: 'center'
                    }}>
                      <button 
                        onClick={() => themSoSanhVaChuyenTrang(sp)} 
                        style={{ 
                          background: '#2196f3',
                          color: 'white',
                          border: 'none',
                          padding: '5px 15px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        So sánh
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </Slider>
        </div>
      </div>

      {/* Banner giống Home.js */}
      <div className="carousel-inner" style={{ padding: '10px', marginTop: '30px' }}>
        <div className="carousel-item active">
          <img src={banner_n1} style={{ width: '1200px', height: '170px', borderRadius: '10px' }} className="d-block w-100" alt="Banner 1" />
        </div>
        <div className="carousel-item">
          <img src={banner5} style={{ width: '1200px', height: '170px', borderRadius: '10px' }} className="d-block w-100" alt="Banner 2" />
        </div>
        <div className="carousel-item">
          <img src={banner_n1} style={{ width: '1200px', height: '170px', borderRadius: '10px' }} className="d-block w-100" alt="Banner 3" />
        </div>
      </div>
      {/* SP sell */}
      <div>
        <div>
              
        </div>
        <div style={{ marginTop: '30px', marginBottom: '30px' }}>
        <div className="titile_SP">
          <h2>SẢN PHẨM SELL</h2>
          <hr className="h_r"></hr>
        </div>
        
        <div className="slider-container" style={{ width: '100%', marginTop: '20px' }}>
          <Slider {...slideSettings}>
            {Array.isArray(listsp) && listsp
              .sort((a, b) => a.gia_km - b.gia_km) // Sắp xếp theo giá từ thấp đến cao
              .slice(0, 8)
              .map((sp, i) => (
                <div key={i} style={{ padding: '0 10px', position: 'relative' }}>
                  <div style={{ 
                    border: '1px solid #e8e8e8', 
                    borderRadius: '8px', 
                    padding: '15px', 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* Nhãn giảm giá */}
                    {sp.gia_km && sp.gia_km < sp.gia && (
                      <div style={{ 
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        background: '#ff0000',
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        zIndex: 3
                      }}>
                        Giảm {Math.round(((sp.gia - sp.gia_km) / sp.gia) * 100)}%
                      </div>
                    )}
                    
                    {/* Nút thêm vào giỏ hàng */}
                    <div style={{ 
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      zIndex: 3,
                      width: '30px',
                      height: '30px',
                      background: '#ffffff',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                    }} onClick={() => xuli(sp)}>
                      <i className="bi bi-bag-plus-fill" style={{ color: '#2196f3' }}></i>
                    </div>
                    
                    {/* Ảnh sản phẩm */}
                    <div style={{ 
                      height: '150px', 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '10px'
                    }}>
                      <Link to={`/sanpham/${sp.id}/${sp.id_loai}`}>
                        <img 
                          src={sp.hinh} 
                          alt={sp.ten_sp} 
                          style={{ 
                            maxWidth: '100%',
                            maxHeight: '130px',
                            objectFit: 'contain'
                          }} 
                        />
                      </Link>
                    </div>
                    
                    {/* Tên sản phẩm */}
                    <div style={{ 
                      fontSize: '14px',
                      fontWeight: 'bold',
                      height: '40px',
                      overflow: 'hidden',
                      marginBottom: '8px'
                    }}>
                      <Link to={`/sanpham/${sp.id}/${sp.id_loai}`} style={{ 
                        color: '#333',
                        textDecoration: 'none'
                      }}>
                        {sp.ten_sp}
                      </Link>
                    </div>
                    <div style={{
                      fontSize:"12px",
                    }}>
                      <i className="fa-solid fa-eye"></i> {sp.luot_xem}
                    </div>
                    {/* Giá */}
                    <div style={{ 
                      color: '#ff0000',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      marginBottom: '5px'
                    }}>
                      {parseFloat(sp.gia_km || sp.gia).toLocaleString("vi")}₫
                    </div>
                    
                    {/* Giá gốc */}
                    {sp.gia_km && sp.gia_km !== sp.gia && (
                      <div style={{ 
                        color: '#999',
                        fontSize: '12px',
                        textDecoration: 'line-through'
                      }}>
                        {parseFloat(sp.gia).toLocaleString("vi")}₫
                      </div>
                    )}
                    
                    {/* Nút so sánh */}
                    <div style={{ 
                      marginTop: '10px',
                      textAlign: 'center'
                    }}>
                      <button 
                        onClick={() => themSoSanhVaChuyenTrang(sp)} 
                        style={{ 
                          background: '#2196f3',
                          color: 'white',
                          border: 'none',
                          padding: '5px 15px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        So sánh
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </Slider>
        </div>
      </div>
      </div>
      {/* Box sản phẩm tương tự Home.js */}
      <div className="box_titile_Home" style={{ marginTop: '30px' }}>
        <div className="titile_SP">
          <h2>SẢN PHẨM ĐỀ XUẤT</h2>
          <hr className="h_r"></hr>
        </div>
      </div>
      <div className="tong_box_SP">
        {Array.isArray(listsp) && listsp.map((sp, i) => (
          <div className="box_SP" key={i}>
            {sp.phan_tram_gg && (
              <div className="box_SP_khuyen_mai">
                Giảm {sp.phan_tram_gg}%
              </div>
            )}
            <div className="box_SP_anh">
              <Link to={`/sanpham/${sp.id}/${sp.id_loai}`}>
                <img src={sp.hinh} title={sp.ten_sp.toUpperCase()} alt={sp.ten_sp} />
              </Link>
            </div>
            <div className="cart_icon" onClick={() => xuli(sp)}>
              <i className="bi bi-bag-plus-fill"></i>
            </div>
            <div className="box_SP_tensp">
              <Link to={`/sanpham/${sp.id}/${sp.id_loai}`}>{sp.ten_sp}</Link>
            </div>
            <div className="box_SP_RAM_SSD">
              <div><button className="box_SP_RAM">RAM: {sp.ram}</button></div>
              <div><button className="box_SP_SSD">SSD: {sp.dia_cung}</button></div>
            </div>
            <div className="box_SP_gia">
              <div className="box_SP_gia_km" style={{color: '#ff0000', fontWeight: 'bold'}}>
                {parseFloat(sp.gia_km).toLocaleString("vi")} VNĐ
              </div>
              <div className="box_SP_gia_goc" style={daSapXep ? {color: '#999'} : {}}>
                <del>{parseFloat(sp.gia).toLocaleString("vi")} VNĐ</del>
              </div>
            </div>
            <div className="box_SP_luot_xem"><p>Lượt xem: {sp.luot_xem}</p></div>
            <div className="box_SP_icon">
              <div className="box_SP_icon_star">
                <div className="box_SP_icon_star_dam"><i className="bi bi-star-fill"></i></div>
                <div className="box_SP_icon_star_dam"><i className="bi bi-star-fill"></i></div>
                <div className="box_SP_icon_star_dam"><i className="bi bi-star-fill"></i></div>
                <div className="box_SP_icon_star_dam"><i className="bi bi-star-fill"></i></div>
                <div className="box_SP_icon_star_nhat"><i className="bi bi-star-fill"></i></div>
                <div className="box_SP_icon_star_dg"><p>(Đánh giá)</p></div>
              </div>
              <div className="so_sanh">
                <button className="so_sanh_btn" onClick={() => themSoSanhVaChuyenTrang(sp)}>
                  So sánh
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Compare Box */}
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

export default SPXemNhieu;