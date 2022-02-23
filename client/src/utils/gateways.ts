import apiClient from '@/utils/http-common';
import { showErrorNotification } from '@/utils/notification';
import Student from '@/models/Student';
import Internship from '@/models/Internship';

export const getStudentsList = async (semester: string) => apiClient
  .get(`/students?semester=${semester}`)
  .then((res) => res.data)
  .catch((err) => {
    console.log(err);
    return [];
  });

export const getStudent = async (studentId: string): Promise<Student | null> => {
  try {
    const response = await apiClient.get(`/students/${studentId}`);
    return response.data;
  } catch (err: any) {
    if (err.response?.data?.error?.message) err.message = err.response.data.error.message;
    await showErrorNotification(`Fehler beim Laden von Student:in ${studentId} [ERROR: ${err.message}]`);
    return null;
  }
};

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

export const deleteInternshipModule = async (internshipModuleId: string): Promise<boolean> => {
  try {
    await apiClient.delete(`/internship-modules/${internshipModuleId}`);
    return true;
  } catch (err: any) {
    if (err.response?.data?.error?.message) err.message = err.response.data.error.message;
    await showErrorNotification(`Fehler beim Löschen vom Internship Module ${internshipModuleId} [ERROR: ${err.message}]`);
    return false;
  }
};

export const deleteInternship = async (internshipId: string): Promise<boolean> => {
  try {
    await apiClient.delete(`/internships/${internshipId}`);
    return true;
  } catch (err: any) {
    if (err.response?.data?.error?.message) err.message = err.response.data.error.message;
    await showErrorNotification(`Fehler beim Löschen vom Praktikum ${internshipId} [ERROR: ${err.message}]`);
    return false;
  }
};

export const markAepPassedOnInternshipModule = async (id) => apiClient.patch(`/internship-modules/${id}/aep-passed`)
  .then((res) => res)
  .catch((err) => {
    console.log(err);
    return [];
  });

export const approveInternshipApplication = async (
  internshipId: string,
): Promise<Internship | null> => {
  try {
    const response = await apiClient.patch(`/internships/${internshipId}/approve`);
    return response.data;
  } catch (err: any) {
    if (err.response?.data?.error?.message) err.message = err.response.data.error.message;
    await showErrorNotification(`Fehler beim Updaten des Praktikums ${internshipId} [ERROR: ${err.message}]`);
    return null;
  }
};

export const markInternshipAsPassed = async (
  internshipId: string,
): Promise<Internship | null> => {
  try {
    const response = await apiClient.patch(`/internships/${internshipId}/pass`);
    return response.data;
  } catch (err: any) {
    if (err.response?.data?.error?.message) err.message = err.response.data.error.message;
    await showErrorNotification(`Fehler beim Updaten des Praktikums ${internshipId} [ERROR: ${err.message}]`);
    return null;
  }
};

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

// TODO: Also used in Home. Consolidate
export const loadAvailableSemesters = async (): Promise<string[]> => {
  try {
    const res = await apiClient.get('/info/semesters');
    return await res.data;
  } catch (err: any) {
    if (err.response?.data?.error?.message) err.message = err.response.data.error.message;
    await showErrorNotification(`Fehler beim Abfragen der verfügbaren semester [ERROR: ${err.message}]`);
    return [];
  }
};

// TODO: Also used in CreateInternship. Consolidate
export const loadPaymentTypes = async (): Promise<string[]> => {
  try {
    const res = await apiClient.get('/info/payment-types');
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.error?.message) err.message = err.response.data.error.message;
    await showErrorNotification(`Fehler beim Laden der verfügbaren Bezahlungsmodelle [ERROR: ${err.message}]`);
    return [];
  }
};
