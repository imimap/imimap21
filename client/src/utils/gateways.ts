import apiClient, { API_HOST } from '@/utils/http-common';
import { showErrorNotification } from '@/utils/notification';
import Student from '@/models/Student';
import Internship from '@/models/Internship';
import InternshipModule from '@/models/InternshipModule';
import Postponement from '@/models/Postponement';
import Company from '@/models/Company';
import { PdfDocument } from '@/store/types/PdfDocument';

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

export const clearStudentSearch = async (id: string) => apiClient.patch(`/students/${id}/clear-search`)
  .then((res) => res)
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

export const getCompaniesList = async (): Promise<Company[]> => {
  try {
    const response = await apiClient.get('/companies');
    return response.data.map((company) => Company.parseFromAPIResponseData(company));
  } catch (err: any) {
    if (err.response?.data?.error?.message) err.message = err.response.data.error.message;
    await showErrorNotification(`Fehler beim Laden der Unternehmen [ERROR: ${err.message}]`);
    return [];
  }
};

export const updateCompany = async (
  companyId: string,
  payload: unknown,
): Promise<Company | null> => {
  try {
    const response = await apiClient.patch(`/companies/${companyId}`, payload);
    return Company.parseFromAPIResponseData(response.data);
  } catch (err: any) {
    if (err.response?.data?.error?.message) err.message = err.response.data.error.message;
    await showErrorNotification(`Fehler beim Updaten vom Unternehmen ${companyId} [ERROR: ${err.message}]`);
    return null;
  }
};

export const deleteCompany = async (companyId: string): Promise<boolean> => {
  try {
    await apiClient.delete(`/companies/${companyId}`);
    return true;
  } catch (err: any) {
    if (err.response?.data?.error?.message) err.message = err.response.data.error.message;
    await showErrorNotification(`Fehler beim Löschen des Unternehmens ${companyId} [ERROR: ${err.message}]`);
    return false;
  }
};

export const getPostponementsList = async (): Promise<Postponement[]> => {
  try {
    const response = await apiClient.get('/postponement-requests');
    return response.data;
  } catch (err: any) {
    if (err.response?.data?.error?.message) err.message = err.response.data.error.message;
    await showErrorNotification(`Fehler beim Laden der Verschiebungsanträge [ERROR: ${err.message}]`);
    return [];
  }
};

export const acceptPostponement = async (id: string): Promise<boolean> => {
  try {
    await apiClient.patch(`/postponement-requests/${id}/accept`);
    return true;
  } catch (err: any) {
    if (err.response?.data?.error?.message) err.message = err.response.data.error.message;
    await showErrorNotification(`Fehler beim Akzeptieren des Verschiebungsantrags [ERROR: ${err.message}]`);
    return false;
  }
};

export const rejectPostponement = async (id: string): Promise<boolean> => {
  try {
    await apiClient.patch(`/postponement-requests/${id}/reject`);
    return true;
  } catch (err: any) {
    if (err.response?.data?.error?.message) err.message = err.response.data.error.message;
    await showErrorNotification(`Fehler beim Ablehnen des Verschiebungsantrags [ERROR: ${err.message}]`);
    return false;
  }
};

export const updatePostponement = async (
  id: string,
  payload: unknown,
): Promise<Postponement | null> => {
  try {
    const response = await apiClient.patch(`/postponement-requests/${id}`, payload);
    return response.data;
  } catch (err: any) {
    if (err.response?.data?.error?.message) err.message = err.response.data.error.message;
    await showErrorNotification(`Fehler beim Updaten vom Verschiebungsantrag ${id} [ERROR: ${err.message}]`);
    return null;
  }
};

export const loadAvailableSemesters = async (): Promise<string[]> => {
  try {
    const res = await apiClient.get('/info/semesters');
    return await res.data;
  } catch (err: any) {
    if (err.response?.data?.error?.message) err.message = err.response.data.error.message;
    await showErrorNotification(`Fehler beim Abfragen der verfügbaren Semester [ERROR: ${err.message}]`);
    return [];
  }
};

export const loadUpcomingSemesters = async (): Promise<string[]> => {
  try {
    const res = await apiClient.get('/info/semesters/upcoming');
    return await res.data;
  } catch (err: any) {
    if (err.response?.data?.error?.message) err.message = err.response.data.error.message;
    await showErrorNotification(`Fehler beim Abfragen der kommenden Semester [ERROR: ${err.message}]`);
    return [];
  }
};

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

export const getAvailableLanguages = async () => {
  try {
    const res = await apiClient.get('/info/languages');
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.error?.message) err.message = err.response.data.error.message;
    await showErrorNotification(`Fehler beim Laden der verfügbaren Sprachen [ERROR: ${err.message}]`);
    return null;
  }
};

export const loadPDFFile = async (filePath: string) => {
  try {
    const response = await apiClient.get(`${API_HOST}/${filePath}`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (err: any) {
    if (err.response?.data?.error?.message) err.message = err.response.data.error.message;
    await showErrorNotification(`Fehler beim Laden der PDF-Datei [ERROR: ${err.message}]`);
    return null;
  }
};

export const uploadPDFFile = async (internshipId: string, pdfFile: File, pdfType: string): Promise<PdfDocument | null> => {
  const formData = new FormData();
  formData.append('pdf', pdfFile);

  const requestConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  try {
    const response = await apiClient.post(`/internships/${internshipId}/pdf/${pdfType}`, formData, requestConfig);
    return response.data;
  } catch (err: any) {
    if (err.response?.data?.error?.message) err.message = err.response.data.error.message;
    await showErrorNotification(`Fehler beim Hochladen der PDF-Datei [ERROR: ${err.message}]`);
    return null;
  }
};

export const generateRequestPdf = async (internshipId: string) => {
  try {
    const response = await apiClient.get(`/internships/${internshipId}/pdf/request`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (err: any) {
    if (err.response?.data?.error?.message) err.message = err.response.data.error.message;
    await showErrorNotification(`Fehler beim Laden der PDF-Datei [ERROR: ${err.message}]`);
    return null;
  }
};

export const deleteComment = async (internshipId: string, commentId: string): Promise<Internship | null> => {
  try {
    const response = await apiClient.delete(`/internships/${internshipId}/comments/${commentId}`);
    return response.data;
  } catch (err: any) {
    if (err.response?.data?.error?.message) err.message = err.response.data.error.message;
    await showErrorNotification(`Fehler beim Löschen des Kommentars [ERROR: ${err.message}]`);
    return null;
  }
};
