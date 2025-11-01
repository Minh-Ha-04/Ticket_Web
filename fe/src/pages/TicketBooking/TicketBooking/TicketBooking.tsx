import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './TicketBooking.module.scss';
import classNames from 'classnames/bind';
import instance from '../../../utils/axiosInstance';
import StadiumView from '../StadiumView';
import SectionView from '../SectionView';
import BookingSummary from '../BookingSummnary';

const cx = classNames.bind(styles);

function TicketBooking() {
  const { matchId } = useParams<{ matchId: string }>();
  const [match, setMatch] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [activeSection, setActiveSection] = useState<any | null>(null);
  const [selectedTickets, setSelectedTickets] = useState<any[]>([]);
  const [sectionTickets, setSectionTickets] = useState<any[]>([]);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const stadium_ID = process.env.REACT_APP_HOME_STADIUM_ID;

  useEffect(() => {
    const fetchMatchData = async () => {
      const { data: matchData } = await instance.get(`/matches/${matchId}`);
      const { data: sectionsData } = await instance.get(`/sections/stadium/${stadium_ID}`);
      setMatch(matchData);
      setSections(sectionsData.sections); 
    };
    fetchMatchData();
  }, [matchId]);


  const handleSelectSection = async (section: any) => { 
    setLoadingSeats(true);
    try {
      const { data : ticketData } = await instance.get(`/tickets/section/${section.id}/match/${matchId}`);
      const { data: seatData } = await instance.get(`/seats/section/${section.id}`);  
      const seatsArray = Array.isArray(seatData) ? seatData : seatData.seats || [];
      // console.log("seatData:", seatsArray);
      setActiveSection({ ...section, seats: seatsArray });
      setSectionTickets(ticketData.tickets);
    } catch (err) {
      console.error("Lỗi tải vé:", err);
    } finally {
      setLoadingSeats(false);
    }
  };

  const handleBackToOverview = () => {
    setActiveSection(null);
  };

  const handleTicketSelect = (ticket: any) => {
    if (!activeSection) return;
  
    setSelectedTickets((prev) => {
      const isSelected = prev.some((t) => t.ticket.id === ticket.id);
      
      if (isSelected) {
        // Nếu đã chọn → bỏ chọn
        return prev.filter((t) => t.ticket.id !== ticket.id);
      } else {
        // Nếu chưa chọn → thêm vào
        return [...prev, { section: activeSection, ticket }];
      }
    });
  };

  return (
    <div className={cx('container')}>
      {!activeSection ? (
        <StadiumView
          match={match}
          sections={sections}
          onSelectSection={handleSelectSection}
        />
      ) : (
        <SectionView
          match={match}
          section={activeSection}
          onBack={handleBackToOverview}
          onTicketSelect={handleTicketSelect}
          selectedTickets={selectedTickets
            .filter((t) => t.section.id === activeSection?.id)}
          tickets = {sectionTickets}
          
        />

      )}

      <BookingSummary
        selectedTickets ={selectedTickets}        
        onRemoveTicket={(ticketToRemove) => {
          setSelectedTickets((prev) =>
            prev.filter(
              (t) => t.ticket.id !== ticketToRemove.id 
            )
          );
        }}
      />
    </div>
  );
}

export default TicketBooking;
