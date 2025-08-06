import axiosInstance from "./axiosInstance";


export const applyJob = (applicationData) => {
  console.log("📡 applicationService: applyJob called with:", applicationData);
  console.log("📡 applicationService: Making POST request to /api/v1/applications/apply");
  return axiosInstance.post("/api/v1/applications/apply", applicationData);
}

export const getUserApplications = () => {
  return axiosInstance.get("/api/v1/applications/my-applications");
}


export const getApplicationsByJobId = (jobId) => {
  return axiosInstance.get(`/api/v1/applications/job-applications/${jobId}`);
}

export const updateApplicationStatus = (applicationId, status) => {
  console.log(`📡 applicationService: updateApplicationStatus called with ID: ${applicationId} and status: ${status}`);
  return axiosInstance.put(`/api/v1/applications/update-status/${applicationId}`, { status });
}