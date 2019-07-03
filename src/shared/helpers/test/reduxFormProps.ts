import { InjectedFormProps } from 'redux-form';

const makeMockHandleSubmit = <T>(mockFormData?: T) => jest.fn((f: any) => () => mockFormData ? f(mockFormData) : f());

const mockReduxFormProps: InjectedFormProps = {
  anyTouched: false,
  array: {
    insert: jest.fn(),
    move: jest.fn(),
    pop: jest.fn(),
    push: jest.fn(),
    remove: jest.fn(),
    removeAll: jest.fn(),
    shift: jest.fn(),
    splice: jest.fn(),
    swap: jest.fn(),
    unshift: jest.fn(),
  },
  asyncValidate: jest.fn(),
  asyncValidating: false,
  autofill: jest.fn(),
  blur: jest.fn(),
  change: jest.fn(),
  clearAsyncError: jest.fn(),
  destroy: jest.fn(),
  dirty: false,
  error: '',
  form: 'form-name',
  handleSubmit: makeMockHandleSubmit(),
  initialize: jest.fn(),
  initialized: false,
  initialValues: {},
  invalid: false,
  pristine: false,
  reset: jest.fn(),
  submitFailed: false,
  submitSucceeded: false,
  submitting: false,
  touch: jest.fn(),
  untouch: jest.fn(),
  valid: false,
  warning: false,
  registeredFields: {},
};

const makeMockReduxFormProps = <T>(mockFormData: T) => {
  return {
    ...mockReduxFormProps,
    handleSubmit: makeMockHandleSubmit(mockFormData),
  };
};

export { mockReduxFormProps, makeMockReduxFormProps };
