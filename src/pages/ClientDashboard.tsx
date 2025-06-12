
import { Navigate } from "react-router-dom";

const ClientDashboard = () => {
  // Redirect to the new client dashboard structure
  return <Navigate to="/client/dashboard" replace />;
};

export default ClientDashboard;
