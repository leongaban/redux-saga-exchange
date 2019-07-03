# Conventions

## Naming Conventions

### Component name
Component name must be the same everywhere, meaning that a scss file name, a tsx file name, a js-class name, and a css-class name cannot differ from one another.

**Motivation**: having the same name for every case helps in component files searching.

**Example**: OrderList.tsx, OrderList.scss, class OrderList, order-list.

### Redux

Communication state should be named the same as the action (in general, non-redux sense) it represents: `saveTheme`, `loadConfig` etc. Communication actions connected to the communication state should be named the same as the communication state (execute action) or with the "Fail" and "Success" prefixes (fail and success actions).

**Motivation:** the same naming helps in searching and debugging.

**Example:**
```
export const { execute: saveTheme, completed: saveThemeSuccess, failed: saveThemeFail } =
  makeCommunicationActionCreators<NS.ISaveTheme, NS.ISaveThemeSuccess, NS.ISaveThemeFail>(
    'CONFIG:SAVE_THEME', 'CONFIG:SAVE_THEME_SUCCESS', 'CONFIG:SAVE_THEME_FAIL',
  );

export interface IReduxState {
communication: {
  ...
  saveTheme: ICommunication;
};
```

### Event handlers

Methods for event handlers should be named in the following way: handle[ElementName][EventName].

[ElementName]: the element name. Must correspond with the css class name on the element (it's the same entity and naming it differently is not very logical anyway).

For higher order functions the name pattern is: make[ElementName][EventName]Handler.

If two handlers have the same logic then it should be moved to another method which should be called in both handlers.

**Motivation**: having the unified handlers and their props names helps to navigate within a component and understand what the method/prop is about more easily.

**Example**:
```
private renderSomeContainer() {
  return (
    <div
      className={b('some-container')()}
      onClick={this.makeSomeContainerClickHandler(arg)}
      onMousemove={this.handleSomeContainerMousemove}
    />
  );
}.


private doSomething(arg?: any) {
  ...
}

private handleSomeContainerMousemove() {
  this.doSomething();
}

private makeSomeContainerClickHandler(arg) {
  this.doSomething(arg);
}
```

### Mobile

React components used only in mobile version should have the `M` prefix.

If a mobile version of an already existing desktop component is being added, it should be named the same as the desktop component but with the `M` prefix, and placed in the component folder's mobile subfolder.

Prefixes `m` and `M` also may be used in action creators, selectors, sagas, even method names etc. to indicate mobile-usage only. There is no strong rule for applying the prefixes in such cases and decisions should be made just based on the common sense and the motivation.

**Motivation:** prefixes help to differentiate between the desktop and mobile logic.

**Examples**: MOrderList, MOrderChart, MAssetsTable. You also can check out the logic behind `currentCurrencyPairID` in `config` service.

## Import formatting

Imports must be placed in specific order:
1. Absolute imports from node_modules
2. Absolute imports from src
3. Relative imports

**Motivation:** ordered imports help to find an import you're looking for.

**Example:**
```
import * as React from 'react';
import block from 'bem-cn';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { arrayPush } from 'redux-form';

import { Modal } from 'shared/view/elements';
import { IPreset } from 'shared/types/models';
import { IAppReduxState } from 'shared/types/app';
import { actions as notificationActions } from 'services/notification';
import { selectors as configSelectors } from 'services/config';

import { actions, selectors } from '../../../redux';
import { managePresetsFormEntry } from '../../../redux/reduxFormEntries';
import { Presets } from '../../components/ManagePresets';
import './ManagePresets.scss';
```
