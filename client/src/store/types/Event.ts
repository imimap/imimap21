export interface Event {
  timestamp: number;
  creator: string;
  changes: {
    [key: string]: string | number | boolean;
    status: string;
  };
  accept?: boolean;
  comment?: string;
}
