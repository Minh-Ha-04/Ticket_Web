import styles from "./Ticket.module.scss";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";

interface Team {
  id: number;
  name: string;
  logo: string;
}

interface TicketProps {
  match: {
    id: number;
    poster: string;
    homeTeamId: number;
    awayTeamId: number;
    matchDate: string;
    homeTeam: Team;
    awayTeam: Team;
    isTicketCreated: boolean;
    minPrice: number;
  };
}

function Ticket({ match }: TicketProps) {
  const cx = classNames.bind(styles);

  const formattedDate = new Date(match.matchDate).toLocaleString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return match.isTicketCreated ? (
      <Link to={`/ticket/${match.id}`} className={cx("link")}>
        {children}
      </Link>
    ) : (
      <div className={cx("link-disabled")}>{children}</div>
    );
  };

  return (
    <Wrapper>
      <div className={cx("wrapper", { disabled: !match.isTicketCreated })}>
        <img src={match.poster} alt="Match Poster" className={cx("poster")} />
        <div className={cx("content")}>
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

          <div className={cx("price")}>
            {match.minPrice ? (
              <>
                Giá vé chỉ từ{" "}
                <span className={cx("price-value")}>
                  {match.minPrice.toLocaleString("vi-VN")}₫
                </span>
              </>
            ) : (
              <span className={cx("no-price")}>Vé chưa mở bán</span>
            )}
          </div>

          <div className={cx("date")}>{formattedDate}</div>
        </div>
      </div>
    </Wrapper>
  );
}

export default Ticket;
