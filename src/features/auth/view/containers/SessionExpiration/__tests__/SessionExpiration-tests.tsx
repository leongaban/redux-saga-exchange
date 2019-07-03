import * as React from 'react';
import { SessionExpiration, IProps } from '../SessionExpiration';
import { localeProps } from 'shared/helpers/test';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Button } from 'shared/view/elements';

function getShallowComponent(props?: Partial<IProps>) {
  const defaultProps: IProps = {
    ...localeProps,
    isTimerStarted: false,
    timerValue: 0,
    startTimer: jest.fn(),
    stopTimer: jest.fn(),
    onClose: jest.fn(),
    onSessionExpired: jest.fn(),
  };
  return shallow(<SessionExpiration {...defaultProps} {...props} />);
}

describe('Feature Auth', () => {
  describe('container SessionExpiration', () => {
    it('must rendered without crash', () => {
      const component = getShallowComponent();
      expect(toJson(component)).toMatchSnapshot();
    });

    it('endSessionTime: 320, must render timer with 05:20', () => {
      const component = getShallowComponent({ timerValue: 320 });
      expect(toJson(component)).toMatchSnapshot();
    });

    it('click on button must call stopTimer', () => {
      const stopTimer = jest.fn();
      const component = getShallowComponent(({ stopTimer, isTimerStarted: true }));
      expect(stopTimer).toHaveBeenCalledTimes(0);
      component.find(Button).simulate('click');
      expect(stopTimer).toHaveBeenCalledTimes(1);
    });

    it('when component did mount must call startTimer', () => {
      const startTimer = jest.fn();
      const component = getShallowComponent(({ startTimer }));
      component.find(Button).simulate('click');
      expect(startTimer).toHaveBeenCalledTimes(1);
    });
  });
});
