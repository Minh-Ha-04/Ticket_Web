import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './TicketBooking.module.scss';
import classNames from 'classnames/bind';
import instance from '../../../utils/axiosInstance';
import StadiumView from '../StadiumView';
import SectionView from '../SectionView';
import BookingSummary from '../BookingSummnary';

const cx = classNames.bind(styles);

interface Team {
  id: number;
  name: string;
  logo: string;
}

interface Stadium {
  id: number;
  name: string;
}

interface Match {
  id: number;
  poster: string;
  homeTeamId: number;
  awayTeamId: number;
  matchDate: string;
  homeTeam: Team;
  awayTeam: Team;
  stadium: Stadium;
  stadiumId: number;
}

interface Section {
  id: number;
  name: string;
  seatCount: number;
  price: number;
  stadiumId: number;
}

interface Seat {
  id: number;
  number: string;
  isAvailable: boolean;
  sectionId: number;
}

function TicketBooking() {
  const { matchId } = useParams<{ matchId: string }>();
  const [match, setMatch] = useState<Match | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [activeSection, setActiveSection] = useState<Section | null>(null); // chỉ dùng để xem
  const [selectedTickets, setSelectedTickets] = useState<{ section: Section; seat: Seat }[]>([]);


  useEffect(() => {
    const fetchMatchData = async () => {
      const { data: matchData } = await instance.get(`/matches/${matchId}`);
      const ticketRes = await instance.get(`/tickets/match/${matchId}`);
      setMatch(matchData);
      setSections(ticketRes.data.sections.sections);
    };
    fetchMatchData();
  }, [matchId]);



  const handleBackToOverview = () => {
    setActiveSection(null);
  };
  const handleSeatSelect = (seats: Seat[]) => {
    if (!activeSection) return;
    // Xóa vé cũ của section này rồi thêm vé mới
    setSelectedTickets((prev) => [
      ...prev.filter((t) => t.section.id !== activeSection.id),
      ...seats.map((seat) => ({ section: activeSection, seat })),
    ]);
  };



  return (
    <div className={cx('container')}>
      {!activeSection ? (
        <StadiumView
          match={match}
          sections={sections}
          onSelectSection={setActiveSection}
        />
      ) : (
        <SectionView
          match={match}
          section={activeSection}
          onBack={handleBackToOverview}
          onSeatSelect={handleSeatSelect}
          selectedSeats={selectedTickets
            .filter((t) => t.section.id === activeSection?.id)
            .map((t) => t.seat)}
        />
      )}

      <BookingSummary
        selectedTickets={selectedTickets}
        onRemoveTicket={(ticketToRemove) => {
          setSelectedTickets((prev) =>
            prev.filter(
              (t) =>
                !(t.section.id === ticketToRemove.section.id && t.seat.id === ticketToRemove.seat.id)
            )
          );
        }}
      />


    </div>
  );
}

export default TicketBooking;
