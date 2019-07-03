import { ShallowWrapper } from 'enzyme';
import * as R from 'ramda';

export default function matchSnapshotToEveryProp<T>(
  renderComponent: (props: Partial<T>) => ShallowWrapper<any, any>,
  props: Partial<T>,
) {
  R.forEachObjIndexed((value, key) => {
    const component = renderComponent({ [key]: value } as Partial<T>);
    expect(component).toMatchSnapshot();
  }, props);
}
