import { ErrorType, IServerError } from 'shared/types/errors';

// tslint:disable:max-classes-per-file
export function isErrorStatus(status: number): boolean {
  return status >= 400 && status <= 500;
}

export class AppError extends Error {
  public type: ErrorType;

  constructor(msg?: string, type?: ErrorType) {
    super(msg);
    this.type = type || 'APP';
  }
}

export class ApiError extends AppError {
  public status: number;
  public errors: IServerError[];

  constructor(status: number, errors: IServerError[]) {
    super('API error', 'API');
    this.status = status;
    this.errors = errors;
  }
}
