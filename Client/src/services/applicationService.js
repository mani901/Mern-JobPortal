import axiosInstance from "./axiosInstance";


export const applyJob = (formData) => {
  return axiosInstance.post("/api/v1/applications/apply", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
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