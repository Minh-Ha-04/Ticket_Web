import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Calendar.module.scss";
import instance from "../../utils/axiosInstance";
import { Button, DatePicker } from "antd";
import dayjs from "dayjs";

const cx = classNames.bind(styles);

// =========================
// KIỂU DỮ LIỆU CHUẨN TSX
// =========================
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
  homeTeamId: number;
  awayTeamId: number;
  matchDate: string;
  stadiumId: number;
  isTicketCreated: boolean;
  poster: string | null;
  posterPublicId: string | null;
  homeTeam: Team;
  awayTeam: Team;
  Stadium: Stadium;
}

function Calendar() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  // ==============================
  // LOAD MATCHES
  // ==============================
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await instance.get<Match[]>("/matches");
        setMatches(response.data);
      } catch (err: any) {
        setError(err?.message || "Đã có lỗi xảy ra");
      }
    };
    fetchMatches();
  }, []);

  // ==============================
  // FILTER MATCHES THEO THÁNG
  // ==============================
  const filteredMatches = matches.filter((match: Match) => {
    const d = new Date(match.matchDate);
    const matchMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    return matchMonth === selectedMonth;
  });

  // ==============================
  // HANDLE MONTH CHANGE (AntD)
  // ==============================
  const handleMonthChange = (value: dayjs.Dayjs | null) => {
    if (!value) return;
    setSelectedMonth(value.format("YYYY-MM"));
  };

  return (
    <div className={cx("calendar-container")}>

      {/* HEADER */}
      <div className={cx("schedule-header")}>
        <h1>Lịch Thi Đấu</h1>
        <p className={cx("subtitle")}>Xem lịch các trận đấu theo tháng</p>
      </div>

      {/* MONTH SELECTOR */}
      <div className={cx("month-controller")}>
        <DatePicker
          picker="month"
          value={dayjs(selectedMonth)}
          onChange={handleMonthChange}
          className={cx("month-picker")}
          allowClear={false}
        />
      </div>

      {/* MATCH GRID */}
      <div className={cx("matches-grid")}>
        {filteredMatches.length > 0 ? (
          filteredMatches.map((match: Match) => (
            <div key={match.id} className={cx("match-card")}>

              <div className={cx("match-top")}>
                <span className={cx("match-date")}>
                  {new Date(match.matchDate).toLocaleDateString("vi-VN")}
                </span>
                <span className={cx("match-time")}>
                  {new Date(match.matchDate).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div className={cx("teams")}>
                <div className={cx("team")}>
                  <img src={match.homeTeam.logo} alt={match.homeTeam.name} />
                  <span>{match.homeTeam.name}</span>
                </div>

                <span className={cx("vs")}>VS</span>

                <div className={cx("team")}>
                  <img src={match.awayTeam.logo} alt={match.awayTeam.name} />
                  <span>{match.awayTeam.name}</span>
                </div>
              </div>

              {match.isTicketCreated && (
                <Button
                  type="primary"
                  block
                  className={cx("ticket-btn")}
                  onClick={() => (window.location.href = `/ticket/${match.id}`)}
                >
                  Mua vé
                </Button>
              )}
              <div className={cx("stadium")}>{match.Stadium.name}</div>

            </div>
          ))
        ) : (
          <p className={cx("no-matches")}>Không có trận đấu nào trong tháng này</p>
        )}
      </div>
    </div>
  );
}

export default Calendar;
