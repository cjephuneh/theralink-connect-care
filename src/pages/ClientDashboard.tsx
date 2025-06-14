
import { Navigate } from "react-router-dom";

// Redirect to the client overview page
const ClientDashboard = () => {
  return <Navigate to="/client/overview" replace />;
};

export default ClientDashboard;
