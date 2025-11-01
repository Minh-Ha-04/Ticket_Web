import { useEffect } from 'react';
import styles from './SectionView.module.scss';
import classNames from 'classnames/bind';

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
  seats: Seat[];
}

interface Match {
  id: number;
  poster: string;
}

interface Ticket {
  id: number;
  price: number;
  status: string;
  matchId: number;
  seat : Seat;
  sectionId: number;
}

interface SectionViewProps {
  match: Match | null;
  section: Section;
  onBack: () => void;
  onTicketSelect: (ticket: Ticket) => void;
  selectedTickets: { section: Section; ticket: Ticket }[];
  tickets: Ticket[];
}

function SectionView({ section, onBack, onTicketSelect, selectedTickets, tickets }: SectionViewProps) {
  useEffect(() => {
    console.log("Tickets:", tickets);
  }, [tickets]);
  useEffect(() => {
    console.log("selectedTickets:", selectedTickets);
  }, [selectedTickets]);

  const toggleTicket = (ticket: Ticket) => {
    if (ticket.status !== "available") return;
    onTicketSelect(ticket);
  };

  const columns = Math.ceil(tickets.length / 50);

  return (
    <div className={cx("section-detail")}>
      <Button type="primary" className={cx("back-btn")} onClick={onBack}>
        Quay lại sơ đồ sân
      </Button>

      <h2 className={cx("title")}>{section.name}</h2>

      <div
        className={cx("seats-grid")}
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {tickets.map((ticket) => {
          const isSelected = selectedTickets.some((s) => s.ticket.id === ticket.id);
          return (
            <div
              key={ticket.id}
              onClick={() => toggleTicket(ticket)}
              className={cx("seat", {
                selected: isSelected,
                sold: ticket.status !== "available",
              })}
            />
          );
        })}
      </div>
    </div>
  );
}

export default SectionView;