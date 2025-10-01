// TeamAdmin.tsx
import { useState, useEffect } from "react";
import styles from './TeamAdmin.module.scss';
import classNames from 'classnames/bind';
import instance from "../../utils/axiosInstance";

const cx = classNames.bind(styles);

interface Stadium {
  id: number;
  name: string;
}

function TeamAdmin() {
  const [name, setName] = useState("");
  const [shortname, setShortname] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [stadiumId, setStadiumId] = useState<number | null>(null);
  const [stadiums, setStadiums] = useState<Stadium[]>([]);

  // Lấy danh sách sân từ backend
  useEffect(() => {
    instance.get('/stadiums') // endpoint backend trả về danh sách sân
      .then(res => setStadiums(res.data.stadiums))
      .catch(err => console.log(err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // chuẩn bị form data nếu có file logo
    const formData = new FormData();
    formData.append("name", name);
    formData.append("shortname", shortname);
    if (logo) formData.append("logo", logo);
    if (stadiumId) formData.append("stadiumId", String(stadiumId));

    try {
      await instance.post('/teams', formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Tạo đội thành công!");
      // reset form
      setName(""); setShortname(""); setLogo(null); setStadiumId(null);
    } catch (err) {
      console.error(err);
      alert("Tạo đội thất bại!");
    }
  };

  return (
    <div className={cx('team-admin')}>
      <h2>Tạo đội bóng mới</h2>
      <form onSubmit={handleSubmit} className={cx('team-form')}>
        <div className={cx('form-group')}>
          <label>Tên đội</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className={cx('form-group')}>
          <label>Tên viết tắt</label>
          <input type="text" value={shortname} onChange={e => setShortname(e.target.value)} />
        </div>
        <div className={cx('form-group')}>
          <label>Logo</label>
          <input type="file" accept="image/*" onChange={e => e.target.files && setLogo(e.target.files[0])} />
        </div>
        <div className={cx('form-group')}>
          <label>Sân nhà</label>
          <select value={stadiumId || ""} onChange={e => setStadiumId(Number(e.target.value))}>
            <option value="">Chọn sân</option>
            {stadiums.map(stadium => (
              <option key={stadium.id} value={stadium.id}>{stadium.name}</option>
            ))}
          </select>
        </div>
        <button type="submit">Tạo đội</button>
      </form>
    </div>
  );
}

export default TeamAdmin;
