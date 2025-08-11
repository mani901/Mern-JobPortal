import axiosInstance from "./axiosInstance";

export const updateProfile = (profileData) => {
  return axiosInstance.post("/api/v1/user/profile/update", profileData);
}

export const toggleSaveJob = (jobId) => {
  return axiosInstance.post('/api/v1/user/saved-jobs/toggle', { jobId });
}

export const getSavedJobs = () => {
  return axiosInstance.get('/api/v1/user/saved-jobs');
}