import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { validateToken } from "../../utils/jwt";
import { resetSession } from "../../utils/session";

export const Authenticated = (props) => {
  const { children } = props;
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    let accessToken = localStorage.getItem("accessToken")
    console.log(accessToken)
    if(accessToken && !validateToken(accessToken)){
      resetSession()
      auth.logout()
      navigate("/login", { replace: true, state: { from: location } });
    }
    
    if (!auth.isAuthenticated) {
      navigate("/login", { replace: true, state: { from: location } });
    }
    else {
      setIsVerified(true);
    }
  }, [auth.isAuthenticated, location, navigate]);


  if (!isVerified) {
    return null;
  }
  return <>{children}{console.log(auth)}</>;
};

