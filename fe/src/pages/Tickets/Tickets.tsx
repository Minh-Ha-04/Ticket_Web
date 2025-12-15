import { useEffect, useState } from "react";
import styles from "./Tickets.module.scss";
import classNames from "classnames/bind";
import instance from "../../utils/axiosInstance";
import { message } from "antd";
import Ticket from "../../components/Ticket";

const cx = classNames.bind(styles);


interface Match {
  id: number;
  homeTeamId: number;
  awayTeamId: number;
  matchDate: string;
  stadiumId: number;
  isTicketCreated: boolean;
  poster :string;
  homeTeam: Team;
  awayTeam: Team;
  minPrice : number;
}

interface Team {
  id: number;
  name: string;
  logo: string;
}

function Tickets(){
  const [matches, setMatches] = useState<Match[]>([]);

  const fetchMatches = async () => {
    try {
      const res = await instance.get("/matches");
      setMatches(res.data);
      console.log(res.data);
    } catch (err) {
      message.error("Can't find matches at home stadium!");
    }
  };
  useEffect(() => {
    fetchMatches();
  }, [])
  return (
    <div className={cx("wrapper")}>
      <h2>Danh sách vé</h2>
      <div className={cx("list")}>
            {matches.map((match) => (
              <Ticket key={match.id} match={match} />
            ))}
        </div>
    </div>
  );
};

export default Tickets;
