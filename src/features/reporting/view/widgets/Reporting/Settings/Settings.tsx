import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import { Field, reduxForm, InjectedFormProps, FormSection } from 'redux-form';
import * as R from 'ramda';

import { i18nConnect, ITranslateProps } from 'services/i18n';
import { IHoldingInitialSettings, ReportingContentKind, IReportingFormSettings } from 'shared/types/models';
import { ITab } from 'shared/types/ui';
import { SettingsSection } from 'shared/view/components';
import { Tabs } from 'shared/view/elements';
import { CheckboxField, ICheckboxFieldProps } from 'shared/view/redux-form';
import { activeOrderColumnsTitles, archiveOrderColumnsTitles } from 'shared/constants';

import { reduxFormEntries } from '../../../../redux';
import { reportingContentTabTitleI18nKeys } from '../../../../constants';
import './Settings.scss';

const { name: formName, fieldNames } = reduxFormEntries.reportingSettingsFormEntry;

interface IOwnProps extends IHoldingInitialSettings<IReportingFormSettings> { }

type IProps = InjectedFormProps<IReportingFormSettings, IOwnProps> & IOwnProps & ITranslateProps;

const b = block('reporting-settings');

type ReportingSettingsSectionKind = Exclude<ReportingContentKind, 'trade-history'>;

interface IState {
  activeReportingSettingsSectionKind: ReportingSettingsSectionKind;
}

const reportingSettingsSectionKinds: ReportingSettingsSectionKind[] = ['order-list', 'order-history'];

class Settings extends React.PureComponent<IProps, IState> {
  public state: IState = {
    activeReportingSettingsSectionKind: 'order-list',
  };

  private formSectionRenderers: Partial<Record<ReportingSettingsSectionKind, () => JSX.Element>> = {
    'order-list': this.renderOrderListSection,
    'order-history': this.renderOrderHistorySection,
  };

  public componentDidMount() {
    const { initialize, initialSettings } = this.props;
    initialize(initialSettings);
  }

  public render() {
    const { translate: t } = this.props;
    const tabs: ITab[] = reportingSettingsSectionKinds.map((x: ReportingSettingsSectionKind): ITab => ({
      active: x === this.state.activeReportingSettingsSectionKind,
      key: x,
      title: t(reportingContentTabTitleI18nKeys[x]),
      onClick: this.makeReportingSettingsSectionKindTabClickHandler(x),
    }));
    const formSectionRenderer = this.formSectionRenderers[this.state.activeReportingSettingsSectionKind];

    return (
      <form className={b()}>
        <Tabs tabs={tabs} />
        {formSectionRenderer && formSectionRenderer()}
      </form>
    );
  }

  @bind
  private renderOrderListSection() {
    const { translate: t } = this.props;
    const visibleColumns = R.keys(activeOrderColumnsTitles);

    return (
      <FormSection name={fieldNames.orderList.getName()}>
        <SettingsSection title={t('TRADE:ADD-WIDGET-VISIBLE-COLUMNS-LABEL')}>
          <div className={b('options-section')()}>
            {visibleColumns.map(this.makeColumnOptionsCheckboxRenderer(activeOrderColumnsTitles))}
          </div>
        </SettingsSection>
        <SettingsSection title={t('ORDER-LIST:SHOW-CANCEL-ORDER-CONFIRMATION-DIALOG:OPTION-TITLE')}>
          <div className={b('options-section')()}>
            {this.renderConfirmationModalOptionCheckbox()}
          </div>
        </SettingsSection>
      </FormSection>
    );
  }

  @bind
  private renderOrderHistorySection() {
    const { translate: t } = this.props;
    const visibleColumns = R.keys(archiveOrderColumnsTitles);

    return (
      <FormSection name={fieldNames.orderHistory.getName()}>
        <SettingsSection title={t('TRADE:ADD-WIDGET-VISIBLE-COLUMNS-LABEL')}>
          <div className={b('options-section')()}>
            {visibleColumns.map(this.makeColumnOptionsCheckboxRenderer(archiveOrderColumnsTitles))}
          </div>
        </SettingsSection>
      </FormSection>
    );
  }

  private makeReportingSettingsSectionKindTabClickHandler(x: ReportingSettingsSectionKind) {
    return () => this.setState({ activeReportingSettingsSectionKind: x });
  }

  private makeColumnOptionsCheckboxRenderer<K extends string, T extends Record<K, string>>(labels: T) {
    return (column: K) => {
      return (
        <div className={b('option')()} key={column}>
          <Field<ICheckboxFieldProps>
            component={CheckboxField}
            name={column}
            label={labels[column]}
          />
        </div>
      );
    };
  }

  @bind
  private renderConfirmationModalOptionCheckbox() {
    const { translate: t } = this.props;

    return (
      <div className={b('option')()} key={String(name)}>
        <Field<ICheckboxFieldProps>
          component={CheckboxField}
          name={fieldNames.orderList.shouldOpenCancelOrderModal.getName()}
          label={t('ORDER-LIST:SHOW-CANCEL-ORDER-CONFIRMATION-DIALOG:CHECKBOX-LABEL')}
        />
      </div>
    );
  }
}

export default (
  reduxForm<IReportingFormSettings, IOwnProps>({ form: formName })(
    i18nConnect(
      Settings
    )));
