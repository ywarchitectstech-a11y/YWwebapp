import axiosInstance from "./axiosInstance";

export const createStructure = async (projectId, structure) => {
  const res = await axiosInstance.post(
    `/structure/createstructure/${projectId}`,
    structure
  );

  return res.data;
};