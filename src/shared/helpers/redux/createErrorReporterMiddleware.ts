import { Middleware, Dispatch } from 'redux';

export function createErrorReporterMiddleware(): Middleware {
  return () => (next: Dispatch<any>) => (action: any) => {

    const triggers = ['_FAIL', '_FAILED'];
    const isTrigger = triggers.some(t => action.type.includes(t));

    if (isTrigger) {
      console.error(action);
    }

    return next(action);
  };
}
