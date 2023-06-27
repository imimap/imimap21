import apiClient, { API_HOST } from '@/utils/http-common';
import { showErrorNotification } from '@/utils/notification';
import Student from '@/models/Student';
import Internship from '@/models/Internship';
import InternshipModule from '@/models/InternshipModule';
import Postponement from '@/models/Postponement';
import Company from '@/models/Company';
import { PdfDocument } from '@/store/types/PdfDocument';
import { MapLocation } from '@/store/types/MapLocation';
import { Internship as IInternship } from '@/store/types/Internship';
import { InternshipModule as IInternshipModule } from '@/store/types/InternshipModule';

let es;
export const addServerEventListener = (email, listener) => {
  if (!es) es = new EventSource(`${API_HOST}/api/info/events/${email}`);
  es.addEventListener('message', listener, false);
};

export const removeServerEventListener = () => {
  if (es) {
    es.close();
    es = undefined;
  }
};

export const setMaintenanceMode = async (isOn: boolean): Promise<boolean> => apiClient
  .get(`/x/maintenance/${isOn}`)
  .then((res) => res.data).catch((err) => {
    console.log(err);
    return { maintenanceMode: false };
  });

export const getStudentsList = async (semester: string | undefined): Promise<Student[]> => apiClient
  .get(`/students${semester !== undefined ? `?semester=${semester}` : ''}`)
  .then((res) => res.data).catch((err) => {
    console.log(err);
    return [];
  });

export const getOnlineUsers = async (): Promise<string[]> => apiClient
  .get('/x/onlineUsers')
  .then((res) => res.data).catch((err) => {
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

export const getInternshipsInSemester = async (semester: string): Promise<MapLocation[]> => {
  try {
    const response = await apiClient.get('/internships/locations', { params: { semester } });
    return response.data;
  } catch (err: any) {
    if (err.response?.data?.error?.message) err.message = err.response.data.error.message;
    await showErrorNotification(`Fehler beim Laden der Praktika für Semester ${semester} [ERROR: ${err.message}]`);
    return [];
  }
};

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

export const getAuthUserInternship = async (): Promise<IInternshipModule | null> => {
  try {
    const res = await apiClient.get('/internship-modules/my');
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.error?.message) err.message = err.response.data.error.message;
    await showErrorNotification(`Fehler beim Laden Deines Praktikums [ERROR: ${err.message}]`);
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
  force?: boolean,
): Promise<Internship | null> => {
  try {
    const response = await apiClient.patch(`/internships/${internshipId}/approve`, { force });
    return response.data;
  } catch (err: any) {
    if (err.response?.data?.error?.message) err.message = err.response.data.error.message;
    if (force) await showErrorNotification(`Fehler beim Updaten des Praktikums ${internshipId} [ERROR: ${err.message}]`);
    return null;
  }
};

export const markInternshipAsOver = async (
  internshipId: string,
  force?: boolean,
): Promise<Internship | null> => {
  try {
    const response = await apiClient.patch(`/internships/${internshipId}/over`, {});
    return response.data;
  } catch (err: any) {
    if (err.response?.data?.error?.message) err.message = err.response.data.error.message;
    if (force) await showErrorNotification(`Fehler beim Updaten des Praktikums ${internshipId} [ERROR: ${err.message}]`);
    return null;
  }
};

export const markInternshipAsPassed = async (
  internshipId: string,
  force?: boolean,
): Promise<Internship | null> => {
  try {
    const response = await apiClient.patch(`/internships/${internshipId}/pass`, { force });
    return response.data;
  } catch (err: any) {
    if (err.response?.data?.error?.message) err.message = err.response.data.error.message;
    if (force) await showErrorNotification(`Fehler beim Updaten des Praktikums ${internshipId} [ERROR: ${err.message}]`);
    return null;
  }
};

export const getCompaniesList = async (): Promise<Company[]> => {
  try {
    const response = await apiClient.get('/companies?limit=500');
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

export const requestPostponement = async (
  newSemester: string,
  newSemesterOfStudy: number,
  reason: string,
): Promise<boolean> => {
  try {
    await apiClient.post('/postponement-requests', {
      newSemester,
      newSemesterOfStudy,
      reason,
    });
    return true;
  } catch (err: any) {
    if (err.response?.data?.error?.message) err.message = err.response.data.error.message;
    await showErrorNotification(`Fehler beim Beantragen der Verschiebung [ERROR: ${err.message}]`);
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

export const loadCurrentSemester = async (): Promise<string> => {
  try {
    const res = await apiClient.get('/info/semesters/current');
    return await res.data;
  } catch (err: any) {
    if (err.response?.data?.error?.message) err.message = err.response.data.error.message;
    await showErrorNotification(`Fehler beim Abfragen der aktuellen Semester [ERROR: ${err.message}]`);
    return '';
  }
};
export const loadInternshipStatuses = async (): Promise<string[]> => {
  try {
    const res = await apiClient.get('/info/internship-statuses');
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.error?.message) err.message = err.response.data.error.message;
    await showErrorNotification(`Fehler beim Laden der verfügbaren Internship-Status [ERROR: ${err.message}]`);
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

export const loadCountries = async (): Promise<string[]> => {
  try {
    const res = await apiClient.get('/info/countries');
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.error?.message) err.message = err.response.data.error.message;
    await showErrorNotification(`Fehler beim Laden der verfügbaren Länder [ERROR: ${err.message}]`);
    return [];
  }
};

export const loadOperationalAreas = async (): Promise<string[]> => {
  try {
    const res = await apiClient.get('/info/operational-areas');
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.error?.message) err.message = err.response.data.error.message;
    await showErrorNotification(`Fehler beim Laden der verfügbaren Bereiche [ERROR: ${err.message}]`);
    return [];
  }
};

export const loadProgrammingLanguages = async (): Promise<string[]> => {
  try {
    const res = await apiClient.get('/info/programming-languages');
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.error?.message) err.message = err.response.data.error.message;
    await showErrorNotification(`Fehler beim laden der verfügbaren Programmiersprachen [ERROR: ${err.message}]`);
    return [];
  }
};

export const getAmountOfPossibleNewResults = async (
  country?: string,
  operationalArea?: string,
  programmingLanguage?: string,
  paymentType?: string,
): Promise<number | null> => {
  try {
    const res = await apiClient.get('/companies/possibleResults/amount', {
      params: {
        country,
        operationalArea,
        programmingLanguage,
        paymentType,
      },
    });
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.error?.message) err.message = err.response.data.error.message;
    await showErrorNotification(`Fehler beim Laden der neuen Suchergebnisse [ERROR: ${err.message}]`);
    return null;
  }
};

export const getAmountOfSeenResults = async (): Promise<number | null> => {
  try {
    const res = await apiClient.get('/companies/seen/amount');
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.error?.message) err.message = err.response.data.error.message;
    await showErrorNotification(`Fehler beim Laden der vorherigen Suchergebnisse [ERROR: ${err.message}]`);
    return null;
  }
};

export const getInternshipsOfCompaniesSeen = async (): Promise<IInternship[]> => {
  try {
    const res = await apiClient.get('/companies/seen/results');
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.error?.message) err.message = err.response.data.error.message;
    await showErrorNotification(`Fehler beim Laden der vorherigen Suchergebnisse [ERROR: ${err.message}]`);
    return [];
  }
};

export const searchInternships = async (
  country?: string,
  operationalArea?: string,
  programmingLanguage?: string,
  paymentType?: string,
): Promise<IInternship[]> => {
  try {
    const res = await apiClient.get('/internships/searchResults', {
      params: {
        country,
        operationalArea,
        programmingLanguage,
        paymentType,
      },
    });
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.error?.message) err.message = err.response.data.error.message;
    await showErrorNotification(`Fehler beim Suchen nach Praktika [ERROR: ${err.message}]`);
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
    // API_HOST needed as base URL since pdfs aren't stored under the /api path
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

const processPdf = async (internshipId: string, pdfType: string, accept: boolean, reason?: string): Promise<Internship | null> => {
  const data = accept ? { accept: true } : { reject: true, reason };
  try {
    const response = await apiClient.post(`/internships/${internshipId}/pdf/${pdfType}`, data);
    return response.data;
  } catch (err: any) {
    if (err.response?.data?.error?.message) err.message = err.response.data.error.message;
    await showErrorNotification(`Fehler beim Akzeptieren der PDF-Datei [ERROR: ${err.message}]`);
    return null;
  }
};

export const acceptPdf = async (internshipId: string, pdfType: string) => processPdf(internshipId, pdfType, true);

export const rejectPdf = async (internshipId: string, pdfType: string, reason: string) => processPdf(internshipId, pdfType, false, reason);

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

export const postComment = async (internshipId: string, comment: string): Promise<Internship | null> => {
  try {
    const response = await apiClient.post(`/internships/${internshipId}/comments`, {
      content: comment,
    });
    return response.data;
  } catch (err: any) {
    if (err.response?.data?.error?.message) err.message = err.response.data.error.message;
    await showErrorNotification(`Fehler beim Hinterlassen des Kommentars [ERROR: ${err.message}]`);
    return null;
  }
};
