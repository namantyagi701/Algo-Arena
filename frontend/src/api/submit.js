import axiosInstance from "../lib/axios";

export const submitApi = {
  submit: async (problemId, language, code) => {
    const response = await axiosInstance.post("/submit", {
      problemId,
      language,
      code,
    });
    return response.data;
  },
};
