import jwt_decode from "jwt-decode";

export const validateToken = (token) => {

  const now = Math.round(new Date().getTime() / 1000);
  console.log(now)
  const decodedToken = jwt_decode(token);
  console.log(decodedToken)
  const isValid = decodedToken && now < decodedToken.exp;

  return isValid;
};
