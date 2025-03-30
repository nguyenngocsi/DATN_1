-- Tạo bảng khuyến mãi
CREATE TABLE khuyen_mai (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ten_km VARCHAR(255) NOT NULL,
    mo_ta TEXT,
    ngay_bat_dau DATETIME NOT NULL,
    ngay_ket_thuc DATETIME NOT NULL,
    phan_tram_km INT NOT NULL,
    trang_thai ENUM('active', 'inactive', 'expired') DEFAULT 'active',
    hinh_anh VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tạo bảng chi tiết khuyến mãi (liên kết sản phẩm với khuyến mãi)
CREATE TABLE chi_tiet_km (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_km INT NOT NULL,
    id_sp INT NOT NULL,
    gia_km DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_km) REFERENCES khuyen_mai(id),
    FOREIGN KEY (id_sp) REFERENCES san_pham(id)
);

-- Thêm dữ liệu mẫu
INSERT INTO khuyen_mai (ten_km, mo_ta, ngay_bat_dau, ngay_ket_thuc, phan_tram_km, trang_thai, hinh_anh) VALUES
('Siêu Sale 2024', 'Đại hạ giá toàn bộ sản phẩm', '2024-03-01 00:00:00', '2024-03-31 23:59:59', 30, 'active', 'sale-2024.jpg'),
('Black Friday', 'Giảm giá đặc biệt cho ngày Black Friday', '2024-11-29 00:00:00', '2024-11-30 23:59:59', 50, 'inactive', 'black-friday.jpg'),
('Mùa Hè Sôi Động', 'Giảm giá cho các sản phẩm mùa hè', '2024-06-01 00:00:00', '2024-06-30 23:59:59', 25, 'active', 'summer-sale.jpg');

-- Thêm chi tiết khuyến mãi mẫu
INSERT INTO chi_tiet_km (id_km, id_sp, gia_km) VALUES
(1, 1, 15000000),
(1, 2, 20000000),
(1, 3, 18000000),
(2, 4, 25000000),
(2, 5, 30000000),
(3, 6, 22000000),
(3, 7, 28000000); 