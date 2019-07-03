import { ApiError } from 'shared/helpers/errors';
import { Dispatch } from 'redux';

export type ErrorType = 'APP' | 'API' | 'VIEW';

export type ApiErrorInterceptor = (apiError: ApiError) => void;
export type MakeApiErrorInterceptors = (dispatch: Dispatch<any>) => ApiErrorInterceptor;

export interface IErrorResponse {
  errors?: IServerError[];
}

export interface IServerError {
  code: ServerErrorType;
  message: string;
  key?: string;
  expected?: boolean;
  value?: boolean;
  min?: number;
  max?: number;
}

export interface IClientError<T extends string> {
  name: T;
  getMessage(): string;
}

export type ServerErrorType = 'password_too_short' | 'password_requires_non_alphanumeric' | 'password_requires_lower'
  | 'password_requires_upper' | 'password_requires_digit' | 'duplicate_email' | 'duplicate_user_name'
  | 'invalid_token' | 'email_already_confirmed' | 'user-not-found' | 'invalid_user_name'
  | 'invalid_authentication_code' | 'invalid_address';
