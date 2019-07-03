## To start localy
```npm run dev``` for development purposes in watch mode

## To build localy
```npm run build``` for development purposes without watch mode (see build folder)

## Features
- [x] Typescript 2.x
- [x] React 16.x
- [x] React-router 4.x
- [x] Redux
- [x] Redux-saga for side-effects
- [x] SCSS
- [x] BEM methodology
- [x] Webpack 3.x
- [x] Tests (Jest, sinon, enzyme)
- [x] Hot reload
- [x] Yeoman blocks generator tasks (features, modules, ... )
- [x] Code splitting (async chunks loading)
- [x] Code coverage
- [ ] ANT Design
- [ ] Isomorphic

### [Snapshot Testing](http://facebook.github.io/jest/docs/en/snapshot-testing.html#content)

```
import React from 'react';
import { shallow } from 'enzyme';
import GenericDateInput from './../GenericDateInput';

it('renders correctly', () => {
  const component = shallow(<GenericDateInput />)

  expect(component.debug()).toMatchSnapshot();
});
```
