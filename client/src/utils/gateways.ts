import apiClient from '@/utils/http-common';
import { showErrorNotification } from '@/utils/notification';
import Student from '@/models/Student';
import Internship from '@/models/Internship';
import InternshipModule from '@/models/InternshipModule';

export const getStudentsList = async (semester: string | undefined): Promise<Student[]> => apiClient
  .get(`/students${semester !== undefined ? `?semester=${semester}` : ''}`)
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

// TODO: Basically the same as getStudent above. Consolidate
export const getUser = async (id) => apiClient.get(`/students/${id}`)
  .then((res) => res.data)
  .catch((err) => {
    console.log(err);
    return [];
  });

export const clearStudentSearch = async (id: string) => apiClient.patch(`/students/${id}/clear-search`)
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

export const getInternshipModule = async (id: string) => apiClient.get(`/internship-modules/${id}`)
  .then((res) => res.data)
  .catch((err) => {
    console.log(err);
    return [];
  });

export const updateInternshipModule = async (
  id: string,
  payload: unknown,
): Promise<InternshipModule | null> => {
  try {
    const response = await apiClient.patch(`/internship-modules/${id}`, payload);
    return response.data;
  } catch (err: any) {
    if (err.response?.data?.error?.message) err.message = err.response.data.error.message;
    await showErrorNotification(`Fehler beim Updaten vom Internship Module ${id} [ERROR: ${err.message}]`);
    return null;
  }
};

export const updateInternship = async (
  id: string,
  payload: unknown,
): Promise<Internship | null> => {
  try {
    const response = await apiClient.patch(`/internships/${id}`, payload);
    return response.data;
  } catch (err: any) {
    if (err.response?.data?.error?.message) err.message = err.response.data.error.message;
    await showErrorNotification(`Fehler beim Updaten vom Praktikum ${id} [ERROR: ${err.message}]`);
    return null;
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

export const markAepPassedOnInternshipModule = async (id: string) => apiClient.patch(`/internship-modules/${id}/aep-passed`)
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

export const getCompany = async (id: string) => apiClient.get(`/companies/${id}`)
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

export const getPostponement = async (id: string) => apiClient.get(`/postponement-requests/${id}`)
  .then((res) => res.data)
  .catch((err) => {
    console.log(err);
    return [];
  });

export const acceptPostponement = async (id: string) => apiClient.patch(`/postponement-requests/${id}/accept`)
  .then((res) => res)
  .catch((err) => {
    console.log(err);
    return [];
  });

export const rejectPostponement = async (id: string) => apiClient.patch(`/postponement-requests/${id}/reject`)
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
