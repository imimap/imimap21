import apiClient from '@/utils/http-common';

export const getStudentsList = async () => apiClient.get('/students')
  .then((res) => res.data)
  .catch((err) => {
    console.log(err);
    return [];
  });

export const getUser = async (id) => apiClient.get(`/users/${id}`)
  .then((res) => res.data)
  .catch((err) => {
    console.log(err);
    return [];
  });

export const getInternshipModulesList = async () => apiClient.get('/internship-modules')
  .then((res) => res.data)
  .catch((err) => {
    console.log(err);
    return [];
  });

export const getInternshipModule = async (id) => apiClient.get(`/internship-modules/${id}`)
  .then((res) => res.data)
  .catch((err) => {
    console.log(err);
    return [];
  });

export const getCompaniesList = async () => apiClient.get('/companies')
  .then((res) => res.data)
  .catch((err) => {
    console.log(err);
    return [];
  });

export const getCompany = async (id) => apiClient.get(`/companies/${id}`)
  .then((res) => res.data)
  .catch((err) => {
    console.log(err);
    return [];
  });

export const getPostponementsList = async () => apiClient.get('/internship-modules/postponements')
  .then((res) => res.data)
  .catch((err) => {
    console.log(err);
    return [];
  });

export const getPostponement = async (id) => apiClient.get(`/internship-modules/postponements/${id}`)
  .then((res) => res.data)
  .catch((err) => {
    console.log(err);
    return [];
  });
