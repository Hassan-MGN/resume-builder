import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import PvtRoute from "./components/PvtRoute";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword"
import Builder from "./components/resume/Builder";
import Form from "./components/resume/form/Form";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Signin />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/signin",
    element: <Signin />,
  },
  {
    path: "/dashboard",
    element: <PvtRoute><Dashboard /></PvtRoute>,
  },
  {
  path: "/forgot-password",
  element: <ForgotPassword />
  },
  {
    path:"/reset-password",
    element: <ResetPassword />
  },
  {
    path: "/builder",
    element: <PvtRoute><Builder /></PvtRoute>
  },
  {
    path: "/form",
    element: <PvtRoute><Form /></PvtRoute>
  }
]);