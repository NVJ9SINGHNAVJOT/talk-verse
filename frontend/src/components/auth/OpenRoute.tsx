import { useAppSelector } from '@src/store/store';
import { Navigate, Outlet } from 'react-router-dom';



const PrivateRoute = () => {
    const token = useAppSelector((state) => state.auth.token)

    if(token === null)
        return <Outlet/>
    else
        return <Navigate to="/" />

}

export default PrivateRoute
