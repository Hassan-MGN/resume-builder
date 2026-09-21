import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import Landing from "./components/Landing";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import PvtRoute from "./components/PvtRoute";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Builder from "./components/resume/Builder";
import Profile from "./components/Profile";
import TemplateLibrary from "./components/TemplateLibrary";
import LegalPage from "./components/LegalPage";
import Contact from "./components/Contact";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
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
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/templates",
    element: <PvtRoute><TemplateLibrary /></PvtRoute>,
  },
  {
    path: "/builder",
    element: <PvtRoute><Builder /></PvtRoute>,
  },
  {
    path: "/builder/new",
    element: <PvtRoute><Builder /></PvtRoute>,
  },
  {
    path: "/builder/edit/:draftId",
    element: <PvtRoute><Builder /></PvtRoute>,
  },
  {
    path: "/form",
    element: <PvtRoute><Navigate to="/builder" replace /></PvtRoute>,
  },
  {
    path: "/profile",
    element: <PvtRoute><Profile /></PvtRoute>,
  },
  { path: "/privacy", element: <LegalPage type="privacy" /> },
  { path: "/terms", element: <LegalPage type="terms" /> },
  { path: "/contact", element: <Contact /> },
]);