import axiosInstance from "../lib/axios";

export const adminApi = {
  getStats: async () => {
    const response = await axiosInstance.get("/admin/stats");
    return response.data;
  },

  getProblems: async (params = {}) => {
    const response = await axiosInstance.get("/admin/problems", { params });
    return response.data;
  },

  getProblemById: async (id) => {
    const response = await axiosInstance.get(`/admin/problems/${id}`);
    return response.data;
  },

  createProblem: async (data) => {
    const response = await axiosInstance.post("/admin/problems", data);
    return response.data;
  },

  updateProblem: async (id, data) => {
    const response = await axiosInstance.put(`/admin/problems/${id}`, data);
    return response.data;
  },

  deleteProblem: async (id) => {
    const response = await axiosInstance.delete(`/admin/problems/${id}`);
    return response.data;
  },
};
