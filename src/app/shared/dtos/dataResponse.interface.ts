import { ErrorResponse } from "./errorResponse.interface";

export interface DataResponse<T> {
  success: any;
	data: T | null;
	errorResponse: ErrorResponse | null;
}