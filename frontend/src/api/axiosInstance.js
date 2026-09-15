import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = JSON.parse(sessionStorage.getItem("accessToken")) || "";

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (err) => Promise.reject(err)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest = error.config?.url?.includes("/auth/");

    if (error.response?.status === 401 && !isAuthRequest) {
      sessionStorage.removeItem("accessToken");
      if (!location.pathname.includes("/auth")) {
        location.href = "/auth";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
