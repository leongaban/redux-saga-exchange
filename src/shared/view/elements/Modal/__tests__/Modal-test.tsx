import * as React from 'react';
import block from 'bem-cn';
import { shallow } from 'enzyme';
import Modal from '../Modal';

describe('(Shared) component', () => {

    describe('Modal', () => {

        const b = block('css-modal');

        it('should render', () => {
            const component = shallow(
            <Modal title={'header'} isOpen={true} onClose={jest.fn()} />,
          );

            expect(component.debug()).toMatchSnapshot();
        });

        it('hasCloseCross: true, must contain close cross ', () => {
            const component = shallow(
            <Modal title={'header'} isOpen={true} onClose={jest.fn()} hasCloseCross={true} />,
          );

            expect(component.debug()).toMatchSnapshot();
        });

        it('click on cross must call onClose', () => {
            const onClose = jest.fn();
            const component = shallow(
                <Modal title={'header'} isOpen={true} onClose={onClose} hasCloseCross={true} />,
            );

            component.find(`.${b('cross')}`).simulate('click');
            expect(onClose).toBeCalled();
        });
    });

});
