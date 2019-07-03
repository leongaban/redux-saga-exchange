import { ShallowWrapper } from 'enzyme';
import { initialCommunicationField } from 'shared/helpers/redux';
import { ICommunication } from 'shared/types/redux';

export default function simulateSuccessfulRequest<T>(
  communicationName: keyof T,
  component: ShallowWrapper<any, any>,
) {
  const communicationRequested: ICommunication = { isRequesting: true, error: '' };
  component.setProps({ [communicationName]: communicationRequested });
  component.setProps({ [communicationName]: initialCommunicationField });
}
