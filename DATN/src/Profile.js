import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "./Profile.css";
import { thoat } from "./authSlice";
import { setUser } from "./userSlice";

function Profile() {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [user, setLocalUser] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Thêm state để theo dõi trạng thái tải

  useEffect(() => {
    if (!userId) {
      setError("Lỗi: Không tìm thấy userId từ URL!");
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Vui lòng đăng nhập lại");
      dispatch(thoat());
      navigate("/auth");
      setIsLoading(false);
      return;
    }

    const fetchUserProfile = async () => {
      try {
        console.log("Fetching profile for userId:", userId); // Debug
        const response = await fetch(`http://localhost:3000/profile/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log("Response status:", response.status); // Debug
        if (response.status === 401) {
          setError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại");
          dispatch(thoat());
          navigate("/auth");
          setIsLoading(false);
          return;
        }

        if (!response.ok) {
          const errorText = await response.text(); // Lấy thông báo lỗi từ server
          throw new Error(`Lỗi: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log("Data received:", data); // Debug
        setLocalUser(data);
        setEditedUser(data);
        dispatch(setUser(data));
        setPreviewUrl(data.hinh ? `http://localhost:3000/uploads/${data.hinh}` : null);
      } catch (err) {
        console.error("Lỗi fetch:", err.message);
        setError(err.message);
      } finally {
        setIsLoading(false); // Đảm bảo kết thúc trạng thái tải
      }
    };

    fetchUserProfile();
  }, [userId, dispatch, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Vui lòng đăng nhập lại");
        dispatch(thoat());
        navigate("/auth");
        return;
      }

      const response = await fetch(`http://localhost:3000/profile/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(editedUser),
      });

      if (response.status === 401) {
        setError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại");
        dispatch(thoat());
        navigate("/auth");
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Cập nhật thất bại: ${errorText}`);
      }

      const updatedUser = await response.json();
      setLocalUser(updatedUser);
      dispatch(setUser(updatedUser));
      setSuccessMessage("Cập nhật thành công!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.message);
      console.error("Lỗi update:", err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Vui lòng chọn ảnh trước khi tải lên!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Vui lòng đăng nhập lại");
      dispatch(thoat());
      navigate("/auth");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", selectedFile);

    try {
      const response = await fetch(`http://localhost:3000/profile/${userId}/upload-avatar`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      if (response.status === 401) {
        setError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại");
        dispatch(thoat());
        navigate("/auth");
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload ảnh thất bại: ${errorText}`);
      }

      const updatedUser = await response.json();
      setLocalUser(updatedUser);
      dispatch(setUser(updatedUser));
      setPreviewUrl(`http://localhost:3000/uploads/${updatedUser.hinh}`);
      setSelectedFile(null);
      setSuccessMessage("Upload ảnh thành công!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.message);
      console.error("Lỗi upload:", err);
    }
  };

  const Logout = () => {
    if (window.confirm("Bạn muốn đăng xuất?")) {
      dispatch(thoat());
      navigate("/");
    }
  };

  if (isLoading) return <p>Đang tải thông tin...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!user) return <p>Không có dữ liệu người dùng</p>;

  return (
    <div className="profile-container">
      <div className="profile-left">
        <div className="profile-header">Thông tin tài khoản</div>
        <div className="profile-info">
          <div className="info-row">
            <span className="info-label">Tên đăng nhập</span>
            <span className="info-value">{user.email}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Họ và tên</span>
            <span className="info-value">{user.name}</span>
          </div>
        </div>   
        {successMessage && <p className="success-message">{successMessage}</p>}
        {error && <p className="error-message">{error}</p>}
        
        <div className="profile-form">
          <div className="form-group">
            <label htmlFor="name">Họ và tên</label>
            <input type="text" id="name" name="name" value={editedUser.name || ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Điện thoại</label>
            <input type="text" id="phone" name="dien_thoai" value={editedUser.dien_thoai || ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={editedUser.email || ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="dia_chi">Địa chỉ</label>
            <input type="text" id="dia_chi" name="dia_chi" value={editedUser.dia_chi || ''} onChange={handleChange} />
          </div>
          <button className="update-button" onClick={handleUpdate}>CẬP NHẬT THÔNG TIN</button>
        </div>

        <div className="profile-header">Cập nhật ảnh đại diện</div>
        <div className="profile-avatar-upload">
          <label htmlFor="avatar-upload" className="upload-label">Chọn ảnh</label>
          <input
            type="file"
            id="avatar-upload"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <button className="upload-button" onClick={handleUpload}>Tải ảnh lên</button>
          {selectedFile ? (
            <span>{selectedFile.name}</span>
          ) : (
            <span>Không có tập nào được chọn</span>
          )}
          {previewUrl && (
            <img src={previewUrl} alt="Avatar" width="150" />
          )}
        </div>
      </div>

      <div className="profile-right">
        <div className="profile-card">
          <img src={previewUrl || `http://localhost:3000/uploads/${user.hinh}`} alt="" width="150" />
          <h2>{user.name}</h2>
        </div>
        <ul className="profile-menu">
          <li>Thông tin tài khoản</li>
          <li>Lịch sử đơn hàng</li>
          <li>Lịch sử giao dịch</li>
          <li>Mật khẩu và bảo mật</li>
          <li>Bình luận của tôi</li>
          <li>Sản phẩm yêu thích</li>
          <li>
            <button className="logout" onClick={Logout}>Đăng xuất</button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Profile;