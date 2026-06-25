import api from "./api";

export const createIssue = async (formData) => {
  const { data } = await api.post("/issues", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};