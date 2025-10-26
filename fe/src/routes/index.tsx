    import { RouteObject } from "react-router-dom";

    import LayoutDefault from "../layouts/LayoutDefault";
    import LayoutAuth from "../layouts/LayoutAuth";
    import LayoutAdmin from "../layouts/LayoutAdmin";

    import Home from "../pages/Home";
    import Ticket from "../pages/Tickets";
    import Login from "../pages/Login/Login";
    import TicketBooking from "../pages/TicketBooking/TicketBooking";

    import LoginSuccess from "../pages/LoginSucess";
    import PageError from "../pages/PageError";

    import TeamAdmin from "../pages/TeamAdmin";
    import MatchAdmin from "../pages/MatchAdmin";
    import TicketAdmin from "../pages/TicketAdmin";
    import Admin from "../pages/Admin";
    import StadiumAdmin from "../pages/StadiumAdmin";
    import SectionSeatAdmin from "../pages/SectionSeatAdmin";

    import ProtectedRoute from "./ProtectedRoute";

    const routes : RouteObject[] = [
        {
            element: <LayoutDefault />,
            children: [
                {path: "/", element: <Home />},
                {path: "/ticket", element: <Ticket />},
                {path: "/ticket/:matchId",element : <TicketBooking/>}
            ]

        },
        {
            element: <LayoutAuth />,
            children:[
                {path: "/login",element:<Login />},
                {path:"/login-success",element:<LoginSuccess/>},
                {path:"/login-failed",element:<PageError/>}
            ]
        },
        {   path: "/admin",
            element:<ProtectedRoute>
                        <LayoutAdmin />
                    </ProtectedRoute>,
            children:[
                {index: true ,element:<Admin />},
                {path: "teams",element:<TeamAdmin />},
                {path: "matches",element:<MatchAdmin />},
                {path: "tickets",element:<TicketAdmin />},
                {path: "stadiums",element: <StadiumAdmin />},
                {path: "stadiums/:id/sections",element: <SectionSeatAdmin/>}
            ]
        }

    ]

    export default routes;