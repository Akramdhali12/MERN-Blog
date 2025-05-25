import { useSelector } from "react-redux"
import { Outlet,Navigate } from "react-router-dom";

export default function OnlyAdminPrivateRoute() {
    const {currentUser} = useSelector((state)=>state.user);
  return currentUser && currentUser.isAdmin ? <Outlet/> : <Navigate to="/sign-in" />;//jodi user admin na hoy tahole redirect kore sign-in page ae niye jabe
}
