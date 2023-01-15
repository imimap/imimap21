export interface Event {
  _id: string;
  timestamp: number;
  creator: string;
  changes: {
    [key: string]: string | number | boolean;
    status: string;
  };
  accept?: boolean;
  comment?: string;
  type: string;
}
