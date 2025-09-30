import { useEffect, useState } from "react";
import styles from "./Tickets.module.scss";
import classNames from "classnames/bind";

import { fetchAllTickets, Ticket as TicketType } from "../../services/ticketService";
import Ticket from "../../components/Ticket";

const cx = classNames.bind(styles);

const Tickets = () => {
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadTickets = async () => {
      try {
        setLoading(true);
        const res = await fetchAllTickets(1, 10); // gọi API lấy vé
        setTickets(res.tickets);
        setTotal(res.total);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  return (
    <div className={cx("wrapper")}>
      <h2>Danh sách vé</h2>
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <>
          <div className={cx("list")}>
            {tickets.map((ticket) => (
              <Ticket key={ticket.id} ticket={ticket} />
            ))}
          </div>
          <p>Tổng số vé: {total}</p>
        </>
      )}
    </div>
  );
};

export default Tickets;
