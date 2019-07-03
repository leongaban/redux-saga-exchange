import { ApiError } from 'shared/helpers/errors';
import { ServerErrorType, IServerError } from 'shared/types/errors';
import * as R from 'ramda';
/**
 * @summary
 * Checks error, caught in try/catch block and returns correct error representation of that
 */
function getErrorMsg(error: any): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (isApiError(error)) {
    return error.message;
  }

  return String(error);
}

export function isApiError(error: ApiError | Error): error is ApiError {
  return (error as ApiError).type === 'API';
}

export function getApiError(error: ApiError) {
  return R.curry(getFieldError)(error.errors);
}

export function isUserNotFoundError(error: ServerErrorType) {
  return error === 'user-not-found';
}

export function isNicknameError(error: ServerErrorType) {
  return error === 'invalid_user_name';
}

export function isTokenInvalidError(error: ServerErrorType) {
  return error === 'invalid_token';
}

export function isEmailAlreadyConfirmedError(error: ServerErrorType) {
  return error === 'email_already_confirmed';
}

export function isPasswordError(code: ServerErrorType) {
  const passwordErrorTypes: ServerErrorType[] = [
    'password_too_short',
    'password_requires_non_alphanumeric',
    'password_requires_lower',
    'password_requires_upper',
    'password_requires_digit',
  ];
  return passwordErrorTypes.includes(code);
}

export function getFieldError(errors: IServerError[], predicate: (code: ServerErrorType) => boolean): string {
  return errors.reduce((sum, cur) => {
    return predicate(cur.code) ? sum + cur.message + '\n ' : sum;
  }, '');
}

export function getNicknameError(error: ApiError, value: string) {
  const codes: string[] = error.errors.map(x => x.code);
  if (codes.includes('duplicate_user_name')) {
    return `Nickname "${value}" is already taken`;
  }
  if (codes.includes('invalid_user_name')) {
    return `Nickname "${value}" is invalid, can only contain letters or digits`;
  }
}

export default getErrorMsg;
