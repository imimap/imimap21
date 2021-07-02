import { StudentProfile } from '@/store/types/StudentProfile';

export interface UserProfileState {
  emailAddress: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  studentProfile: StudentProfile | null;
}
