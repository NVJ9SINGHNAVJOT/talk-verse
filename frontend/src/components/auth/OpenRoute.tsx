import { useAppSelector } from "@/redux/store";
import { Navigate, Outlet } from "react-router-dom";

const OpenRoute = () => {
  const authUser = useAppSelector((state) => state.auth.authUser);

  if (authUser === false) return <Outlet />;
  else return <Navigate to="/" />;
};

export default OpenRoute;
