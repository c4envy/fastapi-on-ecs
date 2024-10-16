import axiosInstance from "../services/axios";

export const setSession = (accessToken, refreshToken = null) => {
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem("accessToken");
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }
};

export const resetSession = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  delete axiosInstance.defaults.headers.common["Authorization"];
};



// import axiosInstance from "../services/axios";
// import jwtDecode from "jwt-decode"; // You can use this to decode JWT tokens and extract expiration time

// export const setSession = (accessToken, refreshToken = null) => {
//   if (accessToken) {
//     localStorage.setItem("accessToken", accessToken);
//     axiosInstance.defaults.headers.common[
//       "Authorization"
//     ] = `Bearer ${accessToken}`;

//     // Decode the token to get the expiration time
//     const decodedToken = jwtDecode(accessToken);
//     const expiresAt = decodedToken.exp * 1000; // Convert to milliseconds
//     localStorage.setItem("expiresAt", expiresAt);

//   } else {
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("expiresAt");
//     delete axiosInstance.defaults.headers.common["Authorization"];
//   }

//   if (refreshToken) {
//     localStorage.setItem("refreshToken", refreshToken);
//   }
// };

// export const resetSession = () => {
//   localStorage.removeItem("accessToken");
//   localStorage.removeItem("refreshToken");
//   localStorage.removeItem("expiresAt");
//   delete axiosInstance.defaults.headers.common["Authorization"];
// };

// export const getSession = () => {
//   const accessToken = localStorage.getItem("accessToken");
//   const refreshToken = localStorage.getItem("refreshToken");
//   const expiresAt = localStorage.getItem("expiresAt");
//   return {
//     accessToken,
//     refreshToken,
//     expiresAt,
//   };
// };
