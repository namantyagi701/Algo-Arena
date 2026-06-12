import axiosInstance from "../lib/axios";

export const problemsApi = {
  getAll: async () => {
    const response = await axiosInstance.get("/problems");
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/problems/${id}`);
    return response.data;
  },
};
