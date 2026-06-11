import axiosInstance from "../lib/axios";

export const authApi = {
  signup: async (data) => {
    const response = await axiosInstance.post("/auth/signup", data);
    return response.data;
  },
  login: async (data) => {
    const response = await axiosInstance.post("/auth/login", data);
    return response.data;
  },
  logout: async () => {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
  },
  checkAuth: async () => {
    const response = await axiosInstance.get("/auth/check");
    return response.data;
  },
};
