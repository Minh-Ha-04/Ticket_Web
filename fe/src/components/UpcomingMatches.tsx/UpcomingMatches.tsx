import { useEffect, useState } from "react";
import instance from "../../utils/axiosInstance";
import classNames from "classnames/bind";
import styles from "./UpcomingMatches.module.scss";

const cx = classNames.bind(styles);

interface Team {
  id: number;
  name: string;
  logo: string;
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
}

function UpcomingMatches() {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await instance.get("/matches");
        const sorted = res.data.slice(0, 5);
        setMatches(sorted);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMatches();
  }, []);

  return (
    <div className={cx("upcoming")}>
      <h2 className={cx("title")}>Trận đấu sắp diễn ra</h2>

      {matches.length === 0 ? (
        <p>Không có trận đấu nào!</p>
      ) : (
        matches.map((m) => (
          <div
            key={m.id}
            className={cx("match-item", {
              clickable: m.isTicketCreated,
              disabled: !m.isTicketCreated,
            })}
            onClick={() => {
              if (m.isTicketCreated)
                window.location.href = `/ticket/${m.id}`;
            }}
          >
            <div className={cx("teams")}>
              <div className={cx("team")}>
                <img src={m.homeTeam.logo} alt="" />
                <span>{m.homeTeam.name}</span>
              </div>

              <span className={cx("vs")}>vs</span>

              <div className={cx("team")}>
                <img src={m.awayTeam.logo} alt="" />
                <span>{m.awayTeam.name}</span>
              </div>
            </div>

            <div className={cx("date")}>
              {new Date(m.matchDate).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
              })}
              {" - "}
              {new Date(m.matchDate).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default UpcomingMatches;
