import Language from '@/store/types/Language';

export interface RootState {
  languages: Map<string, Language>;
}

const state: RootState = {
  languages: new Map(),
};

export default state;
