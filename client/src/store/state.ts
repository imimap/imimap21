import Language from '@/store/types/Language';
import Student from '@/models/Student';

export interface RootState {
  languages: Map<string, Language>;
  users: Map<string, Promise<Student | undefined>>;
}

const state: RootState = {
  languages: new Map<string, Language>(),
  users: new Map<string, Promise<Student | undefined>>(),
};

export default state;
