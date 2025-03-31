const express = require('express');
const router = express.Router();
const pool = require('../db'); // Import pool từ db.js

module.exports = (authenticateToken) => {
    router.get('/:product_id', async (req, res) => {
        try {
            const product_id = parseInt(req.params.product_id);
            if (isNaN(product_id) || product_id <= 0) {
                return res.status(400).json({ thongbao: "ID sản phẩm không hợp lệ" });
            }

            const [product] = await pool.query(`SELECT id FROM san_pham WHERE id = ?`, [product_id]);
            if (product.length === 0) {
                return res.status(404).json({ thongbao: "Sản phẩm không tồn tại" });
            }

            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            const [rows] = await pool.query(
                `SELECT c.id, c.user_id, c.user_name, c.Rating, c.Comment_Text, c.product_id, c.created_at,
                        u.hinh as user_avatar
                 FROM comment c
                 LEFT JOIN users u ON c.user_id = u.id
                 WHERE c.product_id = ? 
                 ORDER BY c.created_at DESC 
                 LIMIT ? OFFSET ?`,
                [product_id, limit, offset]
            );

            const [total] = await pool.query(`SELECT COUNT(*) as total FROM comment WHERE product_id = ?`, [product_id]);
            const [avgRating] = await pool.query(`SELECT AVG(Rating) as average_rating FROM comment WHERE product_id = ?`, [product_id]);

            res.json({
                comments: rows,
                total: total[0].total,
                page,
                limit,
                average_rating: avgRating[0].average_rating || 0
            });
        } catch (err) {
            console.error("Lỗi GET /comments:", err);
            res.status(500).json({ thongbao: "Lỗi lấy danh sách bình luận", error: err.message });
        }
    });

    router.post('/', authenticateToken, async (req, res) => {
        try {
            const { user_id, user_name, Rating, Comment_Text, product_id } = req.body;

            if (!user_id || !product_id || !Comment_Text) {
                return res.status(400).json({ thongbao: "Thiếu thông tin bắt buộc" });
            }

            if (req.user.userId !== user_id) {
                return res.status(403).json({ thongbao: "Bạn không có quyền thêm bình luận cho user này" });
            }

            const [user] = await pool.query(`SELECT id FROM users WHERE id = ?`, [user_id]);
            if (user.length === 0) {
                return res.status(404).json({ thongbao: "Người dùng không tồn tại" });
            }

            const ratingValue = parseInt(Rating) || 0;
            if (ratingValue < 0 || ratingValue > 5) {
                return res.status(400).json({ thongbao: "Rating phải từ 0 đến 5" });
            }

            if (!Comment_Text || Comment_Text.length < 1 || Comment_Text.length > 500) {
                return res.status(400).json({ thongbao: "Nội dung bình luận phải từ 1 đến 500 ký tự" });
            }

            const [product] = await pool.query(`SELECT id FROM san_pham WHERE id = ?`, [product_id]);
            if (product.length === 0) {
                return res.status(404).json({ thongbao: "Sản phẩm không tồn tại" });
            }

            const [existingComment] = await pool.query(
                `SELECT id FROM comment WHERE user_id = ? AND product_id = ?`,
                [user_id, product_id]
            );
            if (existingComment.length > 0) {
                return res.status(400).json({ thongbao: "Bạn đã bình luận cho sản phẩm này rồi" });
            }

            const [result] = await pool.query(
                `INSERT INTO comment (user_id, user_name, Rating, Comment_Text, product_id) 
                 VALUES (?, ?, ?, ?, ?)`,
                [user_id, user_name || 'Khách', ratingValue, Comment_Text, product_id]
            );

            const newComment = {
                id: result.insertId,
                user_id,
                user_name: user_name || 'Khách',
                Rating: ratingValue,
                Comment_Text,
                product_id,
                created_at: new Date().toISOString(),
            };

            res.json({ thongbao: "Thêm bình luận thành công", comment: newComment });
        } catch (err) {
            console.error("Lỗi POST /comments:", err);
            res.status(500).json({ thongbao: "Thêm bình luận thất bại", error: err.message });
        }
    });

    return router;
};