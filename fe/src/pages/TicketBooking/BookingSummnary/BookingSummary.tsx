import styles from "./BookingSummary.module.scss";
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

interface Section {
  id: number;
  name: string;
  price: number;
}

interface Seat {
  id: number;
  number: string;
}

interface Ticket {
  section: Section;
  seat: Seat;
}

interface BookingSummaryProps {
  selectedTickets: Ticket[];
  onRemoveTicket: (ticket: Ticket) => void; // callback để bỏ vé
}

function BookingSummary({ selectedTickets, onRemoveTicket }: BookingSummaryProps) {
  if (!selectedTickets.length) return null;

  const total = selectedTickets.reduce(
    (sum, t) => sum + t.section.price,
    0
  );

  // Gom ghế theo khu
  const grouped = selectedTickets.reduce((acc, t) => {
    acc[t.section.name] = acc[t.section.name] || [];
    acc[t.section.name].push(t);
    return acc;
  }, {} as Record<string, Ticket[]>);

  return (
    <div className={cx('summary')}>
      <h3 className={cx('title')}>Tóm tắt đặt vé</h3>
      {Object.entries(grouped).map(([section, tickets]) => (
        <div key={section} className={cx('section')}>
          <strong className={cx('section-name')}>{section}</strong>:
          <div className={cx('seats')}>
            {tickets.map(t => (
              <span key={t.seat.id} className={cx('seat')}>
                {t.seat.number}
                <button 
                  className={cx('remove-btn')} 
                  onClick={() => onRemoveTicket(t)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      ))}
      <p className={cx('total')}>Tổng tiền: {total.toLocaleString()}đ</p>
      <button className={cx('confirm-btn')}>Xác nhận đặt vé</button>
    </div>
  );
}

export default BookingSummary;
