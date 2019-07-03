import { ShallowWrapper } from 'enzyme';
import { ICommunication } from 'shared/types/redux';

export default function simulateErrorRequest<T>(
  communicationName: keyof T,
  component: ShallowWrapper<any, any>,
) {
  const communicationRequested: ICommunication = { isRequesting: true, error: '' };
  const communicationFailed: ICommunication = { isRequesting: false, error: 'error' };
  component.setProps({ [communicationName]: communicationRequested });
  component.setProps({ [communicationName]: communicationFailed });
}
