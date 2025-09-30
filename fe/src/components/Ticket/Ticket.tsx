import styles from "./Ticket.module.scss";
import classNames from "classnames/bind";

import { Link } from "react-router-dom";


interface TicketProps {
  ticket: {
    id: number;
    posterUrl: string;
    matchId: number;
    homeTeamName: string;
    awayTeamName: string;
    matchDate: string;
    price: number;
  };
}

function Ticket({ticket}: TicketProps) {
  const cx = classNames.bind(styles);
  return (
    <Link to={`/tickets/${ticket.id}`}>
    <div className={cx("wrapper")}>
          <img src={ticket.posterUrl || "/default-poster.png"} alt="Match Poster" className={cx("poster")} />  

          <div className={cx("match")}>
            <span className={cx("team")}>{ticket.homeTeamName}</span>
            <span className={cx("vs")}> vs </span>
            <span className={cx("team")}>{ticket.awayTeamName}</span>
          </div>
          
          <div className={cx("price")}>From {ticket.price}</div>

          <div className={cx("date")}>{ticket.matchDate}</div>
    </div>
    </Link>
  );
}
export default Ticket;