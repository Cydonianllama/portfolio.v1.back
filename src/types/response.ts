export interface ResponseAPI<T> {
  status: boolean;
  data?: T;
  message?: string;
}