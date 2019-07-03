import { IReduxEntry } from '../types/app';
import { WidgetSettings, IWidget, WidgetFormSettings } from '../types/models';
import { ActionCreator, Action } from 'redux';

type Selector = (state: any, ...args: any[]) => any;

export interface IEntry<C, A, S, W> {
  containers: C;
  actions: A;
  selectors: S;
  widgets: W;
  redux: IReduxEntry;
}

function makeFeatureEntry<
  C extends Record<string, React.ComponentType<any>>,
  A extends Record<string, ActionCreator<Action> | any>, // TODO FIX TYPE!
  S extends Record<string, Selector>,
  W extends Record<string, IWidget<WidgetSettings, WidgetFormSettings>>
  >(entry: IEntry<C, A, S, W>) {

  const { redux, ...rest } = entry;
  return { ...rest, ...redux };
}

export { makeFeatureEntry };
