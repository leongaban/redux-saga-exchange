import { ConfigProps } from 'redux-form';
import { Layout } from 'react-grid-layout';

import { ICurrencyPair } from '../markets';
import { WidgetSettings, WidgetFormSettings, WidgetKind } from './versioned/latestUnpacked';
import { ICopyOrderToModalPayload, ICopyOrderToWidgetPayload } from '../orders';
import { DeepPartial } from '../../app';

export type IWidgets = Record<WidgetKind, IWidget<WidgetSettings, WidgetFormSettings>>;

export interface IWidgetData {
  kind: WidgetKind;
  uid: string;
}

export interface IHeaderLeftPartWithTitle {
  kind: 'with-title';
}

export interface IHeaderLeftPartWithCustomContent {
  kind: 'with-custom-content';
  Content: React.ComponentType;
}

export interface IHeaderLeftPartWithSettings<T extends WidgetSettings> {
  kind: 'with-settings';
  Content: React.ComponentType<IHeaderLeftPartWithSettingsProps<T> & IHoldingMultiInstanceProps>;
}

export interface IHoldingSettingsProps<S extends WidgetSettings = null> {
  settings: S;
  onSettingsSave(settings: DeepPartial<S>): void;
}

export interface IHeaderLeftPartWithSettingsProps<S extends WidgetSettings> extends IHoldingSettingsProps<S> {
  currentCurrencyPair: ICurrencyPair;
  copyOrderToModal(payload: ICopyOrderToModalPayload): void;
  copyToChatMessage(message: string): void;
}

export interface IHoldingMultiInstanceProps {
  instanceKey?: string;
}

export type HeaderLeftPartView = IHeaderLeftPartWithCustomContent | IHeaderLeftPartWithTitle;
export type HeaderLeftPart<T extends WidgetSettings> = HeaderLeftPartView | IHeaderLeftPartWithSettings<T>;

export interface ISettingsForm<S> {
  Component: React.ComponentType<IHoldingInitialSettings<S> & Partial<ConfigProps<S, IHoldingInitialSettings<S>>>>;
  name: string;
}

export interface IWidgetContentProps<S extends WidgetSettings = null>
  extends IHoldingSettingsProps<S>, IHoldingMultiInstanceProps {
  currentCurrencyPair: ICurrencyPair;
  isWidgetInFullscreenMode: boolean;
  copyOrderToModal(payload: ICopyOrderToModalPayload): void;
  copyOrderToWidget(payload: ICopyOrderToWidgetPayload): void;
  copyToChatMessage(message: string): void;
}

export interface IWidget<S extends WidgetSettings, FormSettings extends WidgetFormSettings> {
  Content: React.ComponentType<IWidgetContentProps<S>>;
  headerLeftPart: HeaderLeftPart<S>;
  settingsForm?: ISettingsForm<FormSettings>;
  removable: boolean;
  titleI18nKey: string;
  disabled?: boolean;
}

export interface IHoldingInitialSettings<T> {
  initialSettings: T;
}

export type IWidgetSizes =
  Required<Pick<Layout, 'minW' | 'minH'>> &
  Pick<Layout, 'isResizable' | 'h' | 'w'>;

export interface IPlainWidgetSizes {
  kind: 'plain';
  value: IWidgetSizes;
}

export interface ISettingsDependentWidgetSizes {
  kind: 'dependent-from-settings';
  getDefault(settings: WidgetSettings): IWidgetSizes;
  getUpdate(
    settings: DeepPartial<WidgetSettings>,
    prevSettings: DeepPartial<WidgetSettings>
  ): Partial<IWidgetSizes> | null;
}

export type WidgetSizes = IPlainWidgetSizes | ISettingsDependentWidgetSizes;
