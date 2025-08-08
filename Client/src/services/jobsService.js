
import axiosInstance from "./axiosInstance";

export const getAllJobs = (page = 1, limit = 10, sort = '-createdAt') => {
  return axiosInstance.get(`/api/v1/jobs/?page=${page}&limit=${limit}&sort=${sort}`);
};

export const searchJobs = (filters = {}, page = 1, limit = 10) => {
  const params = new URLSearchParams();
  
  // Add pagination params
  params.append('page', page);
  params.append('limit', limit);
  
  // Add filter params
  if (filters.searchQuery && filters.searchQuery.trim()) {
    params.append('title', filters.searchQuery.trim());
  }
  if (filters.location && filters.location.trim()) {
    params.append('location', filters.location.trim());
  }
  if (filters.jobTypes && filters.jobTypes.length > 0) {
    params.append('type', filters.jobTypes.join(','));
  }
  if (filters.minSalary && !isNaN(filters.minSalary)) {
    params.append('minSalary', filters.minSalary);
  }
  if (filters.maxSalary && !isNaN(filters.maxSalary)) {
    params.append('maxSalary', filters.maxSalary);
  }
  if (filters.datePosted && filters.datePosted !== 'any') {
    // Convert date filter to a date range
    const now = new Date();
    let startDate;
    switch (filters.datePosted) {
      case 'last-hour':
        startDate = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case 'last-24-hours':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'last-week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'last-month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = null;
    }
    if (startDate) {
      params.append('startDate', startDate.toISOString());
    }
  }

  return axiosInstance.get(`/api/v1/jobs/search?${params.toString()}`);
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