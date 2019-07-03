import * as axios from 'axios';
import qs from 'query-string';

import { isErrorStatus, ApiError } from 'shared/helpers/errors';
import { ApiErrorInterceptor } from 'shared/types/errors';
import { restServerAddress } from '../../config';

type AsyncRequest<T> = Axios.IPromise<Axios.AxiosXHR<T>>;

class HttpActions {
  private request: Axios.AxiosInstance;
  private host = restServerAddress;

  constructor(baseURL: string, errorInterceptors: ApiErrorInterceptor[]) {
    const config: Axios.AxiosXHRConfigBase<null> = {
      baseURL: this.host + baseURL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
      validateStatus: status => !isErrorStatus(status),
      paramsSerializer(params) {
        return qs.stringify(params, { arrayFormat: 'index' });
      }
    };

    this.request = axios.create(config);
    this.request.interceptors.response.use((response) => response,
      (response) => {
        if (response.response) {
          const { status, data } = response.response;
          const apiErrorInstance = new ApiError(
            status,
            data.errors ? data.errors : [],
          );
          errorInterceptors.forEach(f => f(apiErrorInstance));
          throw apiErrorInstance;
        } else {
          throw Error(response.message);
        }
      }
    );
  }

  public get<T>(url: string, params?: object, options?: Axios.AxiosXHRConfigBase<T>): AsyncRequest<T> {
    const config: Axios.AxiosXHRConfigBase<T> = { params, ...options };
    return this.request.get(url, config);
  }

  public post<T>(url: string, data?: any, options?: Axios.AxiosXHRConfigBase<T>): AsyncRequest<T> {
    return this.request.post(url, data, options);
  }

  public patch<T>(url: string, data: any, options: Axios.AxiosXHRConfigBase<T>): AsyncRequest<T> {
    return this.request.patch(url, data, options);
  }

  public del<T>(url: string, data: any, params: object, options: Axios.AxiosXHRConfigBase<T>): AsyncRequest<T> {
    const config: Axios.AxiosXHRConfig<T> = { url, data, params, ...options };
    return this.request.delete(url, config);
  }

  public put<T>(url: string, data: any, params: object, options: Axios.AxiosXHRConfigBase<T>): AsyncRequest<T> {
    return this.request.put(url, data, { params, ...options });
  }

  public getSource(url: string): any {
    const config: Axios.AxiosXHRConfigBase<null> = {
      baseURL: window.location.origin,
      withCredentials: true,
    };
    return axios.get(url, config);
  }
}

export default HttpActions;
