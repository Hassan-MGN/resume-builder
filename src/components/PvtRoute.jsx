import { UserAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import LoadingScreen from "./ui/LoadingScreen";

const PvtRoute = ({ children }) => {
  const { session } = UserAuth();

  if (session === undefined) {
    return <LoadingScreen />;
  }

  const qaMode = import.meta.env.DEV && import.meta.env.VITE_QA_MODE === "true";

  if (!session && !qaMode) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default PvtRoute;
