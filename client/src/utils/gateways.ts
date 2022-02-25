import apiClient from '@/utils/http-common';

export const getStudentsList = async (semester: string) => apiClient
  .get(`/students?semester=${semester}`)
  .then((res) => res.data)
  .catch((err) => {
    console.log(err);
    return [];
  });

export const getUser = async (id) => apiClient.get(`/students/${id}`)
  .then((res) => res.data)
  .catch((err) => {
    console.log(err);
    return [];
  });

export const clearStudentSearch = async (id) => apiClient.patch(`/students/${id}/clear-search`)
  .then((res) => res)
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

export const markAepPassedOnInternshipModule = async (id) => apiClient.patch(`/internship-modules/${id}/aep-passed`)
  .then((res) => res)
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

export const getPostponementsList = async () => apiClient.get('/postponement-requests')
  .then((res) => res.data)
  .catch((err) => {
    console.log(err);
    return [];
  });

export const getPostponement = async (id) => apiClient.get(`/postponement-requests/${id}`)
  .then((res) => res.data)
  .catch((err) => {
    console.log(err);
    return [];
  });

export const acceptPostponement = async (id) => apiClient.patch(`/postponement-requests/${id}/accept`)
  .then((res) => res)
  .catch((err) => {
    console.log(err);
    return [];
  });

export const rejectPostponement = async (id) => apiClient.patch(`/postponement-requests/${id}/reject`)
  .then((res) => res)
  .catch((err) => {
    console.log(err);
    return [];
  });

// here ask for the existing questions in DB
export const getQuestionsList = async () => apiClient.get('/questions')
  .then((res) => res.data)
  .catch((err) => {
    console.log(err);
    return [];
  });

export const getEvaluationsList = async () => apiClient.get('/evaluations')
  .then((res) => res.data)
  .catch((err) => {
    console.log(err);
    return [];
  });

// here ask for the existing feedbacks in DB
export const getFeedbacksList = async () => apiClient.get('/feedbacks')
  .then((res) => res.data)
  .catch((err) => {
    console.log(err);
    return [];
  });
