import { useSelector } from "react-redux";
import {Navigate} from 'react-router-dom' //Navigate is used for maps for direct redirections
import type { RootState } from "../src/app/store";


type ProtectedRouteProps = {
    children: React.ReactNode;
}

function ProtectedRoute({children}:ProtectedRouteProps) {
    const { isAuthenticated } = useSelector((state:RootState)=>state.auth);

    if(!isAuthenticated){
        return <Navigate to="/login" replace/>;
    }
    return <>{children}</>;
}

export default ProtectedRoute;
