import { Route, RouteObject } from "react-router-dom";

import LayoutDefault from "../layouts/LayoutDefault";
import LayoutAuth from "../layouts/LayoutAuth";

import Home from "../pages/Home";
import Ticket from "../pages/Ticket";
import Login from "../pages/Login";
import Register from "../pages/Register";
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
            {path: "/login",element:<Login />},
            {path: "/register",element:<Register />}
        ]
    }

]

export default routes;