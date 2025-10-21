
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './TicketBooking.module.scss';
import classNames from 'classnames/bind';
import instance from '../../utils/axiosInstance';
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
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch match data
  useEffect(() => {
    const fetchMatchData = async () => {
      try {
        const { data } = await instance.get(`/matches/${matchId}`);
        console.log(data);
        setMatch(data);
  
        const sectionsResponse = await instance.get(`/sections/stadium/${data.stadiumId}`);
        console.log(sectionsResponse.data.sections);
        setSections(sectionsResponse.data.sections);
  
        setLoading(false);
      } catch (error) {
        console.error("Error fetching match data:", error);
        setLoading(false);
      }
    };
  
    fetchMatchData();
  }, [matchId]);
  

  // Fetch seats when section is selected
  useEffect(() => {
    if (selectedSection) {
        const fetchSeats = async () => {
            try {
              const { data } = await instance.get(`/seats/section/${selectedSection.id}`);
              setSeats(data);
            } catch (error) {
              console.error('Error fetching seats:', error);
            }
          };
          

      fetchSeats();
      setSelectedSeats([]);
    }
  }, [selectedSection]);

  const handleSectionClick = (section: Section) => {
    setSelectedSection(section);
  };

  const handleSeatClick = (seat: Seat) => {
    if (!seat.isAvailable) return; // Can't select sold seats

    const isSelected = selectedSeats.find((s) => s.id === seat.id);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleCheckout = () => {
    // TODO: Implement checkout logic
    console.log('Selected seats:', selectedSeats);
    console.log('Total price:', totalPrice);
  };

  if (loading || !match) {
    return <div className={cx('loading')}>Đang tải...</div>;
  }

  const totalPrice = selectedSeats.length * (selectedSection?.price || 0);

  // Group sections by position (West, North, East, South)
  const getSectionsByPosition = (position: string) => {
    return sections.filter((s) => s.name.startsWith(position));
  };

  const getSectionColor = (sectionName: string): string => {
    const colorMap: { [key: string]: string } = {
      'Lower': '#3498db',
      'Middle': '#2ecc71',
      'Upper': '#f39c12',
      'Vip': '#e74c3c',
    };

    const type = sectionName.split('-')[1];
    return colorMap[type] || '#95a5a6';
  };

  return (
    <div className={cx('container')}>
      <div className={cx('wrapper')}>
        {/* Header */}
        <div 
          className={cx('header')}
          style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${match.poster})` }}
        >
        </div>

        <div className={cx('content')}>
          {/* Stadium Map */}
          <div className={cx('stadium-section')}>
            <h2 className={cx('section-title')}>Chọn Khu Vực</h2>

            {/* Stadium Visualization */}
            <div className={cx('stadium')}>
              <div className={cx('field')}>SÂN VẬN ĐỘNG</div>

              {/* West Sections */}
              <div className={cx('sections-west')}>
                {getSectionsByPosition('West').map((section) => (
                  <button
                    key={section.id}
                    onClick={() => handleSectionClick(section)}
                    className={cx('section-btn', {
                      active: selectedSection?.id === section.id,
                    })}
                    style={{
                      backgroundColor: getSectionColor(section.name),
                      opacity: selectedSection?.id === section.id ? 1 : 0.7,
                    }}
                  >
                    {section.name.split('-')[1]}
                  </button>
                ))}
              </div>

              {/* North Sections */}
              <div className={cx('sections-north')}>
                {getSectionsByPosition('North').map((section) => (
                  <button
                    key={section.id}
                    onClick={() => handleSectionClick(section)}
                    className={cx('section-btn', {
                      active: selectedSection?.id === section.id,
                    })}
                    style={{
                      backgroundColor: getSectionColor(section.name),
                      opacity: selectedSection?.id === section.id ? 1 : 0.7,
                    }}
                  >
                    {section.name.split('-')[1]}
                  </button>
                ))}
              </div>

              {/* East Sections */}
              <div className={cx('sections-east')}>
                {getSectionsByPosition('East').map((section) => (
                  <button
                    key={section.id}
                    onClick={() => handleSectionClick(section)}
                    className={cx('section-btn', {
                      active: selectedSection?.id === section.id,
                    })}
                    style={{
                      backgroundColor: getSectionColor(section.name),
                      opacity: selectedSection?.id === section.id ? 1 : 0.7,
                    }}
                  >
                    {section.name.split('-')[1]}
                  </button>
                ))}
              </div>

              {/* South Sections */}
              <div className={cx('sections-south')}>
                {getSectionsByPosition('South').map((section) => (
                  <button
                    key={section.id}
                    onClick={() => handleSectionClick(section)}
                    className={cx('section-btn', {
                      active: selectedSection?.id === section.id,
                    })}
                    style={{
                      backgroundColor: getSectionColor(section.name),
                      opacity: selectedSection?.id === section.id ? 1 : 0.7,
                    }}
                  >
                    {section.name.split('-')[1]}
                  </button>
                ))}
              </div>
            </div>

            {/* Section List */}
            <div className={cx('section-list')}>
              {sections.map((section) => (
                <div
                  key={section.id}
                  onClick={() => handleSectionClick(section)}
                  className={cx('section-card', {
                    active: selectedSection?.id === section.id,
                  })}
                  style={{
                    borderColor: getSectionColor(section.name),
                    backgroundColor: selectedSection?.id === section.id ? getSectionColor(section.name) : 'white',
                  }}
                >
                  <div className={cx('section-name')}>{section.name}</div>
                  <div className={cx('section-price')}>
                    {section.price.toLocaleString('vi-VN')}₫
                  </div>
                  <div className={cx('section-capacity')}>
                    {section.seatCount} chỗ
                  </div>
                </div>
              ))}
            </div>

            {/* Seat Selection */}
            {selectedSection && (
              <div className={cx('seat-selection')}>
                <h3 className={cx('seat-title')}>
                  Chọn Ghế - {selectedSection.name}
                </h3>
                <div className={cx('seats-grid')}>
                  {seats.map((seat) => {
                    const isSelected = selectedSeats.find((s) => s.id === seat.id);
                    return (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatClick(seat)}
                        disabled={!seat.isAvailable}
                        className={cx('seat', {
                          available: seat.isAvailable && !isSelected,
                          selected: isSelected,
                          sold: !seat.isAvailable,
                        })}
                        style={{
                          backgroundColor: isSelected
                            ? getSectionColor(selectedSection.name)
                            : undefined,
                        }}
                      >
                        {seat.number.split('-').pop()}
                      </button>
                    );
                  })}
                </div>
                <div className={cx('seat-legend')}>
                  <div className={cx('legend-item')}>
                    <div className={cx('legend-box', 'available')}></div>
                    Trống
                  </div>
                  <div className={cx('legend-item')}>
                    <div 
                      className={cx('legend-box', 'selected')}
                      style={{ backgroundColor: getSectionColor(selectedSection.name) }}
                    ></div>
                    Đã chọn
                  </div>
                  <div className={cx('legend-item')}>
                    <div className={cx('legend-box', 'sold')}></div>
                    Đã bán
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Booking Summary */}
          <div className={cx('summary-section')}>
            <h3 className={cx('summary-title')}>Thông Tin Đặt Vé</h3>

            {selectedSeats.length > 0 ? (
              <>
                <div className={cx('summary-content')}>
                  <div className={cx('info-box')}>
                    <div className={cx('info-label')}>Khu vực</div>
                    <div 
                      className={cx('info-value')}
                      style={{ color: getSectionColor(selectedSection!.name) }}
                    >
                      {selectedSection!.name}
                    </div>
                  </div>

                  <div className={cx('info-box')}>
                    <div className={cx('info-label')}>
                      Ghế đã chọn ({selectedSeats.length})
                    </div>
                    <div className={cx('seats-list')}>
                      {selectedSeats.map((seat) => (
                        <div key={seat.id} className={cx('seat-item')}>
                          <span>{seat.number}</span>
                          <span className={cx('seat-price')}>
                            {selectedSection!.price.toLocaleString('vi-VN')}₫
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={cx('summary-footer')}>
                  <div className={cx('total')}>
                    <span>Tổng cộng:</span>
                    <span className={cx('total-price')}>
                      {totalPrice.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                  <button className={cx('checkout-btn')} onClick={handleCheckout}>
                    Tiến Hành Thanh Toán
                  </button>
                </div>
              </>
            ) : (
              <div className={cx('empty-state')}>
                <div className={cx('empty-icon')}>🎫</div>
                <div className={cx('empty-text')}>
                  {selectedSection ? 'Vui lòng chọn ghế' : 'Vui lòng chọn khu vực'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketBooking;
