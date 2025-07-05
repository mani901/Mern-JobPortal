import axiosInstance from "./axiosInstance";


export const applyJob = (applicationData) => {
  console.log("📡 applicationService: applyJob called with:", applicationData);
  console.log("📡 applicationService: Making POST request to /api/v1/applications/apply");
  return axiosInstance.post("/api/v1/applications/apply", applicationData);
}

export const getUserApplications = () => {
  return axiosInstance.get("/api/v1/applications/my-applications");
}