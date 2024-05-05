import { useAppSelector } from "@/redux/store";
import { Navigate } from "react-router-dom";

type PrivateRouteProps = {
  children: React.ReactNode;
};

const PrivateRoute = (props: PrivateRouteProps) => {
  const children = props.children;
  const authUser = useAppSelector((state) => state.auth.authUser);

  if (authUser === true) return children;
  else return <Navigate to="/login" />;
};

export default PrivateRoute;
