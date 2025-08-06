import axiosInstance from "./axiosInstance";

export const updateProfile = (profileData) => {
  return axiosInstance.post("/api/v1/user/profile/update", profileData);
}