import HttpActions from './HttpActions';
import storage, { LocalStorage } from './localStorage';
// import { IErrorResponse } from 'shared/types/responses';
// import { IHeaders } from './types';
// import { isErrorStatus, makeApiError } from 'shared/helpers/errors';

class BaseApi {
  protected actions: HttpActions;
  protected storage: LocalStorage;

  constructor(actions: HttpActions) {
    this.actions = actions;
    this.storage = storage;
  }

  // protected handleErrors({ status, data }: Axios.AxiosXHR<IErrorResponse> | Axios.AxiosXHR<any>) {
  //   if (isErrorStatus(status)) {
  //     const apiError = makeApiError(status, data);
  //     throw apiError;
  //   }
  // }
}

export default BaseApi;
