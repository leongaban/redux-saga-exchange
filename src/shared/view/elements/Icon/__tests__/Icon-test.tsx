import * as React from 'react';
import { shallow } from 'enzyme';
import Icon from '../Icon';

describe('(Shared) elements', () => {

    describe('Icon', () => {

        it('should render', () => {
            const component = shallow(<Icon className={'class1 class2'} src={'path/to/file'}/>);

            expect(component.debug()).toMatchSnapshot();
        });

    });

});
