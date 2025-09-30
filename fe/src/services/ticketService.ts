import instance from "../utils/axiosInstance";

export interface Ticket {
  id: number;
  matchId: number;
  price: number;
  posterUrl: string;
  homeTeamName: string;
  awayTeamName: string;
  matchDate: string;
}

export interface TicketResponse {
    tickets: Ticket[];
    total: number;
}

export async function fetchAllTickets(page = 1 , pageSize = 10) : Promise<TicketResponse> {
    const res = await instance.get(`/tickets`, {
        params: { page, pageSize }
    });
    return {
        tickets: res.data.data,
        total : res.data.total,
    };
}