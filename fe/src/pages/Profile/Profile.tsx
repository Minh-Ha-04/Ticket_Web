import { useEffect, useState } from "react";
import styles from "./Profile.module.scss";
import classNames from "classnames/bind";
import instance from "../../utils/axiosInstance";
import { Input, Button } from "antd";

const cx = classNames.bind(styles);

interface UserProfile {
  id: number;
  username: string;
  email: string;
  phone: string | null;
  role: string;
  isActive: boolean;
}

interface BookingItem {
  id: number;
  matchName: string;
  seat: string;
  price: number;
  createdAt: string;
}

function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState({ username: "", phone: "" });

  // 🔥 Ẩn/hiện form đổi mật khẩu
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // 📌 Lịch sử vé đã mua
  const [bookingHistory, setBookingHistory] = useState<BookingItem[]>([]);

  // -------- GET PROFILE ----------
  const fetchProfile = async () => {
    try {
      const res = await instance.get("/profile");
      setProfile(res.data.data);

      setForm({
        username: res.data.data.username,
        phone: res.data.data.phone || "",
      });
    } catch (err) {
      alert("Không thể tải thông tin người dùng!");
    }
  };

  // -------- GET BOOKING HISTORY ----------
  const fetchBookingHistory = async () => {
    try {
      const res = await instance.get("/bookings/history");
      setBookingHistory(res.data.data);
    } catch (err) {
      // không alert để tránh phiền
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchBookingHistory();
  }, []);

  // -------- UPDATE PROFILE ----------
  const handleUpdate = async () => {
    try {
      await instance.put("/profile/update", form);
      alert("Cập nhật thành công!");
      fetchProfile();
    } catch (err) {
      alert("Cập nhật thất bại!");
    }
  };

  // -------- CHANGE PASSWORD ----------
  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Mật khẩu mới không trùng nhau!");
      return;
    }

    try {
      await instance.put("/profile/change-password", {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });

      alert("Đổi mật khẩu thành công!");

      // Reset form
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordForm(false);
    } catch (err) {
      alert("Sai mật khẩu cũ hoặc lỗi hệ thống!");
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className={cx("wrapper")}>
      <h2>Thông tin cá nhân</h2>

      <div className={cx("section")}>
        <label>Email</label>
        <Input value={profile.email} disabled />
      </div>

      <div className={cx("section")}>
        <label>Username</label>
        <Input
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
      </div>

      <div className={cx("section")}>
        <label>Số điện thoại</label>
        <Input
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </div>

      <Button type="primary" onClick={handleUpdate} className={cx("btn")}>
        Lưu thay đổi
      </Button>

      {/* -------- BUTTON HIỂN THỊ FORM ĐỔI MẬT KHẨU -------- */}
      <Button
        style={{ marginTop: 30 }}
        onClick={() => setShowPasswordForm(!showPasswordForm)}
      >
        {showPasswordForm ? "Đóng" : "Đổi mật khẩu"}
      </Button>

      {/* -------- FORM ĐỔI MẬT KHẨU -------- */}
      {showPasswordForm && (
        <>
          <h3 style={{ marginTop: 20 }}>Đổi mật khẩu</h3>

          <div className={cx("section")}>
            <label>Mật khẩu cũ</label>
            <Input.Password
              value={passwordForm.oldPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, oldPassword: e.target.value })
              }
            />
          </div>

          <div className={cx("section")}>
            <label>Mật khẩu mới</label>
            <Input.Password
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, newPassword: e.target.value })
              }
            />
          </div>

          <div className={cx("section")}>
            <label>Nhập lại mật khẩu mới</label>
            <Input.Password
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  confirmPassword: e.target.value,
                })
              }
            />
          </div>

          <Button type="primary" onClick={handleChangePassword} className={cx("btn")}>
            Xác nhận đổi mật khẩu
          </Button>
        </>
      )}

      {/* -------- LỊCH SỬ VÉ -------- */}
      <h2 style={{ marginTop: 40 }}>Lịch sử vé đã mua</h2>

      <div className={cx("history")}>
        {bookingHistory.length === 0 ? (
          <p>Chưa có vé nào.</p>
        ) : (
          bookingHistory.map((item) => (
            <div key={item.id} className={cx("history-item")}>
              <p><b>Trận:</b> {item.matchName}</p>
              <p><b>Ghế:</b> {item.seat}</p>
              <p><b>Giá:</b> {item.price.toLocaleString()} VND</p>
              <p><b>Ngày mua:</b> {new Date(item.createdAt).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Profile;
