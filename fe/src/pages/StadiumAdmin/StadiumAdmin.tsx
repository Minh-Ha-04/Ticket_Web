// StadiumAdmin.tsx
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from './StadiumAdmin.module.scss';
import classNames from 'classnames/bind';
import instance from "../../utils/axiosInstance";
import {Modal} from 'antd';


const cx = classNames.bind(styles);

interface Stadium {
  id: number;
  name: string;
  capacity: number;
}

function StadiumAdmin() {
  const [stadiums, setStadiums] = useState<Stadium[]>([]);
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState<number | "">("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Lấy danh sách sân từ backend
  useEffect(() => {
    fetchStadiums();
  }, []);

  const fetchStadiums = async () => {
    try {
      const res = await instance.get('/stadiums');
      setStadiums(res.data.stadiums);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Cập nhật sân
        await instance.put(`/stadiums/${editingId}`, { name, capacity});
        alert("Cập nhật sân thành công!");
      } else {
        // Tạo sân mới
        await instance.post('/stadiums', { name, capacity});
        alert("Tạo sân thành công!");
      }
      setName(""); setCapacity(""); setEditingId(null);
      fetchStadiums();
    } catch (err) {
      console.error(err);
      alert("Thao tác thất bại!");
    }
  };

  const handleEdit = (stadium: Stadium) => {
    setName(stadium.name);
    setCapacity(stadium.capacity);
    setEditingId(stadium.id);
  };

  const showDeleteModal = (id: number) => {
    console.log("Delete clicked, id =", id);
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await instance.delete(`/stadiums/${deleteId}`);
      fetchStadiums();
      alert("Xóa thành công!");
    } catch (err) {
      console.error(err);
      alert("Xóa thất bại!");
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  const navigate = useNavigate();
  const handleManageSections = (id: number) => {
    navigate(`/admin/stadiums/${id}/sections`);
  };

  return (
    <div className={cx('stadium-admin')}>
      <h2>{editingId ? "Cập nhật sân" : "Tạo sân mới"}</h2>
      <form onSubmit={handleSubmit} className={cx('stadium-form')}>
        <div className={cx('form-group')}>
          <label>Tên sân</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className={cx('form-group')}>
          <label>Sức chứa</label>
          <input type="number" value={capacity} onChange={e => setCapacity(Number(e.target.value))} />
        </div>
        <button type="submit">{editingId ? "Cập nhật" : "Tạo sân"}</button>
      </form>

      <h3>Danh sách sân</h3>
      <table className={cx('stadium-table')}>
        <thead>
          <tr>
            <th>Tên sân</th>
            <th>Sức chứa</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {stadiums.map(stadium => (
            <tr key={stadium.id}>
              <td>{stadium.name}</td>
              <td>{stadium.capacity}</td>
              <td>
                <button onClick={() => handleManageSections(stadium.id)}> Chỉnh khu </button>
                <button onClick={() => handleEdit(stadium)}>Sửa thông tin</button>
                <button onClick={() => showDeleteModal(stadium.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        title="Xóa sân"
        open={isDeleteModalOpen}
        onOk={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa sân này?</p>
      </Modal>

    </div>
  );
}

export default StadiumAdmin;
