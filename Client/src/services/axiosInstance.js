import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://mern-jobportal-production.up.railway.app",
  withCredentials: true,
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("Axios: Making request to:", config.baseURL + config.url);
    console.log("Axios: Request config:", config);
    return config;
  },
  (error) => {
    console.log("Axios: Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("Axios: Response received:", response);
    return response;
  },
  (error) => {
    console.log(" Axios: Response error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
