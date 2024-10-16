import axios from "axios";

const baseURL = "http://localhost:8000/api/v1/";
// const baseURL = "http://beatstake-app-alb-460311850.us-east-1.elb.amazonaws.com/api/v1/";

const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
