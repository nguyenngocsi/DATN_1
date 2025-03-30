-- Tắt kiểm tra khóa ngoại tạm thời
SET FOREIGN_KEY_CHECKS = 0;

-- Chọn database
USE laptop_react;

-- Tạo bảng giỏ hàng
CREATE TABLE `gio_hang` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `id_sp` int(11) NOT NULL,
  `so_luong` int(11) NOT NULL DEFAULT 1,
  `gia` decimal(10,2) NOT NULL,
  `gia_km` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_product` (`id_user`,`id_sp`),
  KEY `id_sp` (`id_sp`),
  KEY `id_user` (`id_user`),
  CONSTRAINT `gio_hang_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`),
  CONSTRAINT `gio_hang_ibfk_2` FOREIGN KEY (`id_sp`) REFERENCES `san_pham` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Bật lại kiểm tra khóa ngoại
SET FOREIGN_KEY_CHECKS = 1;

-- Hoàn tất giao dịch
COMMIT; 