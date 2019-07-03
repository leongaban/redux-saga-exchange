import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';

import { IHoldingInitialSettings, IStockChartFormSettings, CandlesticksChartKind } from 'shared/types/models';
import { ToggleField, IToggleFieldProps } from 'shared/view/redux-form';
import { i18nConnect, ITranslateProps } from 'services/i18n';

import { stockChartSettingsFormEntry } from '../../../../redux/reduxFormEntries';
import './Settings.scss';

interface IOwnProps extends IHoldingInitialSettings<IStockChartFormSettings> { }

type IProps = IOwnProps & InjectedFormProps<IStockChartFormSettings, IOwnProps> & ITranslateProps;

const { name: formName, fieldNames } = stockChartSettingsFormEntry;

const b = block('stockchart-settings');

const ToggleFieldWrapper = Field as new () => Field<IToggleFieldProps>;

class Settings extends React.PureComponent<IProps> {

  public componentDidMount() {
    const { initialize, initialSettings } = this.props;
    initialize(initialSettings);
  }

  public render() {

    return (
      <div className={b()}>
        <ToggleFieldWrapper
          name={fieldNames.isZoomEnabled}
          component={ToggleField}
          leftLabel="OFF"
          rightLabel="ON"
          title="Enable Zoom"
        />
        <ToggleFieldWrapper
          name={fieldNames.candlesticksChartKind}
          component={ToggleField}
          leftLabel="OFF"
          rightLabel="ON"
          title="Enable Trading View"
          normalize={this.normalizeEnableTVValue}
          format={this.formatEnableTVValue}
        />
      </div>
    );
  }

  @bind
  private normalizeEnableTVValue(value: boolean): CandlesticksChartKind {
    return value ? 'trading-view' : 'stockchart-x';
  }

  @bind
  private formatEnableTVValue(value: CandlesticksChartKind): boolean {
    return value === 'trading-view';
  }
}

export default (
  reduxForm<IStockChartFormSettings, IOwnProps>({ form: formName })(
    i18nConnect(
      Settings,
    ),
  )
);
