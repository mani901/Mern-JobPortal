
import axiosInstance from "./axiosInstance";

export const getAllJobs = () => {
  return axiosInstance.get("/api/v1/jobs/"); 
};


export const createJob = (jobData) => {
  return axiosInstance.post("/api/v1/jobs/create-job", jobData);
}

export const getJobById = (jobId) => {
  return axiosInstance.get(`/api/v1/jobs/details/${jobId}`);
};


export const getJobsByCompany = ()=>{
  return axiosInstance.get("/api/v1/jobs/company/my-jobs");
}

export const deleteJob = (id)=>{
  return axiosInstance.delete(`/api/v1/jobs/delete/${id}`);
}