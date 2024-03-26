import { useAppSelector } from '@src/store/store';
import { Navigate } from 'react-router-dom';

type PrivateRouteProps = {
    children: React.ReactNode,
}

const PrivateRoute = (props: PrivateRouteProps) => {
    const children = props.children
    const token = useAppSelector((state) => state.auth.token)

    if(token !== null)
        return children
    else
        return <Navigate to="/" />

}

export default PrivateRoute
