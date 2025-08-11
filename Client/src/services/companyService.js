import axiosInstance from "./axiosInstance";

export const RegisterCompany = (companyData) => {
  return axiosInstance.post("/api/v1/company/register", companyData);
};

export const getCompanies = () => {
  return axiosInstance.get("/api/v1/company/get");
};

export const updateCompany = (companyId, companyData) => {
  return axiosInstance.put(`/api/v1/company/update/${companyId}`, companyData);
};
