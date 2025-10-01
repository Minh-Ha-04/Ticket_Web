import { RouteObject } from "react-router-dom";

import LayoutDefault from "../layouts/LayoutDefault";
import LayoutAuth from "../layouts/LayoutAuth";
import LayoutAdmin from "../layouts/LayoutAdmin";

import Home from "../pages/Home";
import Ticket from "../pages/Tickets";
import Login from "../pages/Login/Login";

import TeamAdmin from "../pages/TeamAdmin";
import MatchAdmin from "../pages/MatchAdmin";
import TicketAdmin from "../pages/TicketAdmin";
import Admin from "../pages/Admin";
import StadiumAdmin from "../pages/StadiumAdmin";

const routes : RouteObject[] = [
    {
        element: <LayoutDefault />,
        children: [
            {path: "/", element: <Home />},
            {path: "/ticket", element: <Ticket />},
        ]

    },
    {
        element: <LayoutAuth />,
        children:[
            {path: "/login",element:<Login />}
        ]
    },
    {   path: "/admin",
        element: <LayoutAdmin />,
        children:[
            {index: true ,element:<Admin />},
            {path: "teams",element:<TeamAdmin />},
            {path: "matches",element:<MatchAdmin />},
            {path: "tickets",element:<TicketAdmin />},
            {path: "stadiums",element: <StadiumAdmin />},
        ]
    }

]

export default routes;