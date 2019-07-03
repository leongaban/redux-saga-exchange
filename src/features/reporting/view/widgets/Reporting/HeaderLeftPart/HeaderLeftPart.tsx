import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';

import { IHeaderLeftPartWithSettingsProps, IReportingSettings, ReportingContentKind } from 'shared/types/models';
import { ITab } from 'shared/types/ui';
import { Tabs, Checkbox } from 'shared/view/elements';
import { notDraggableClassName } from 'shared/constants';
import { i18nConnect, ITranslateProps } from 'services/i18n';

import { reportingContentTabTitleI18nKeys } from '../../../../constants';
import './HeaderLeftPart.scss';

type IProps = IHeaderLeftPartWithSettingsProps<IReportingSettings> & ITranslateProps;

const b = block('reporting-header-left-part');

const reportingContentKinds: ReportingContentKind[] = ['order-list', 'order-history', 'operation-history'];

class HeaderLeftPart extends React.PureComponent<IProps> {

  public render() {
    const { settings: { activeReportingContentKind }, translate: t } = this.props;

    const tabs: ITab[] = reportingContentKinds.map((x: ReportingContentKind): ITab => ({
      key: x,
      title: t(reportingContentTabTitleI18nKeys[x]),
      onClick: this.makeReportingContentTabClickHandler(x),
      active: x === activeReportingContentKind,
    }));

    return (
      <div className={b()}>
        <div className={notDraggableClassName}>
          <Tabs tabs={tabs} />
        </div>
        {this.renderHideOtherPairsCheckbox()}
      </div >
    );
  }

  private renderHideOtherPairsCheckbox() {
    const {
      settings: { activeReportingContentKind, hideOtherPairs },
      translate: t,
    } = this.props;
    switch (activeReportingContentKind) {
      case 'order-history':
      case 'order-list':
        return (
          <Checkbox
            label={t('REPORTS:HEADER-LEFT-PART:HIDE-OTHER-PAIRS-LABEL')}
            checked={hideOtherPairs}
            onChange={this.handleHideOtherPairsCheckboxChange}
          />
        );
      default:
        return null;
    }
  }

  @bind
  private handleHideOtherPairsCheckboxChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.props.onSettingsSave({ hideOtherPairs: event.currentTarget.checked });
  }

  @bind
  private makeReportingContentTabClickHandler(x: ReportingContentKind) {
    return () => this.props.onSettingsSave({ activeReportingContentKind: x });
  }
}

export default (
  i18nConnect(
    HeaderLeftPart
  ));
