import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { logOut } from "@/features/userSlice";

function useAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.user);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  const logout = () => {
    dispatch(logOut());
    navigate("/auth/login");
  };

  return {
    user,
    isAuthenticated,
    logout,
  };
}

export default useAuth;
