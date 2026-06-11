import type { PaginationAPI } from "./pagination.js";

export interface ResponseAPI<T> {
  status: boolean;
  data?: T;
  message?: string;
  pagination?: PaginationAPI
}