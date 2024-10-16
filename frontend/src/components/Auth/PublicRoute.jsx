import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export const PublicRoute = (props) => {
  const { children } = props;
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (auth.isAuthenticated && auth.isOtpValidated) {
      navigate("/", { replace: true, state: { from: location } });
    } else if (auth.isAuthenticated && !auth.isOtpValidated) {
      navigate("/otp-verify", { replace: true, state: { from: location } });
    }
    
    else {
      setIsVerified(true);
    }
  }, [auth.isAuthenticated, location, navigate]);

  if (!isVerified) {
    return null;
  }
  return <>{children}</>;
};
