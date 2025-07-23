// src/routes/userroutes.tsx
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Signin } from "../pages/Signin";
import { Contact } from "../pages/Contact";
import { Services } from "../pages/Ourservices";
import { Partners } from "../pages/partners";
import Location from "../pages/location";
import { Error } from "../pages/Error";
import MainLayout from "../layouts/MainLayout";

export const userRoutes = {
  path: "/",
  element: <MainLayout />,
  errorElement: <Error />,
  children: [
    { index: true, element: <Home /> },
    { path: "signin", element: <Signin /> },
    { path: "login", element: <Login /> },
    { path: "contact", element: <Contact /> },
    { path: "services", element: <Services /> },
    { path: "partners", element: <Partners /> },
    { path: "location", element: <Location /> },
  ],
};
