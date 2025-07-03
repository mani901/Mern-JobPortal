import axiosInstance from "./axiosInstance";



export const RegisterCompany = (companyData) => {
  return axiosInstance.post("/api/v1/company/register", companyData);
}