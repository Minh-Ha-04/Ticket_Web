import { useState, useEffect } from 'react';
import styles from './SectionView.module.scss';
import classNames from 'classnames/bind';
import instance from '../../../utils/axiosInstance';
import { Button } from 'antd';
const cx = classNames.bind(styles);

interface Seat {
  id: number;
  number: string;
  isAvailable: boolean; 
  sectionId: number;
}

interface Section {
  id: number;
  name: string;
  seatCount: number;
  price: number;
  stadiumId: number;
}

interface Match {
  id: number;
  poster: string;
}

interface SectionViewProps {
  match: Match | null;
  section: Section;
  onBack: () => void;
  onSeatSelect: (seats: Seat[]) => void;
  selectedSeats: Seat[];
}

function SectionView({ match, section, onBack, onSeatSelect, selectedSeats }: SectionViewProps) {
  const [seats, setSeats] = useState<Seat[]>([]);

  useEffect(() => {
    instance.get(`/seats/section/${section.id}`).then(({ data }) => setSeats(data));
  }, [section.id]);

  const toggleSeat = (seat: Seat) => {
    if (!seat.isAvailable) return;
    const isSelected = selectedSeats.some((s) => s.id === seat.id);
    if (isSelected) {
      onSeatSelect(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      onSeatSelect([...selectedSeats, seat]);
    }
  };

  // Luôn có 50 hàng, số cột = ceil(seats.length / 50)
  const columns = Math.ceil(seats.length / 50);

  return (
    <div className={cx('section-detail')}>
      <Button type='primary' className={cx('back-btn')} onClick={onBack}>
        Quay lại sơ đồ sân
      </Button>

      <h2 className={cx('title')}>{section.name}</h2>

      <div className={cx('seats-grid')} style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`
      }}>
        {seats.map((seat) => {
          const isSelected = selectedSeats.some((s) => s.id === seat.id);
          return (
            <div
              key={seat.id}
              onClick={() => toggleSeat(seat)}
              className={cx('seat', {
                selected: isSelected,
                sold: !seat.isAvailable,
              })}
            />
          );
        })}
      </div>
    </div>
  );
}

export default SectionView;
