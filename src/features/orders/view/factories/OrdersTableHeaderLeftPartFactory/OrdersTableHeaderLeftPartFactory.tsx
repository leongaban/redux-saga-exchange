import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';

import { IHeaderLeftPartWithSettingsProps, IOrderListSettings, IOrderHistorySettings } from 'shared/types/models';
import { DeepPartial } from 'shared/types/app';
import { notDraggableClassName } from 'shared/constants';
import { WidgetTitle, Checkbox } from 'shared/view/elements';
import { i18nConnect, ITranslateProps } from 'services/i18n';

import './OrdersTableHeaderLeftPartFactory.scss';

const b = block('orders-table-header-left-part');

export default function ordersTableHeaderLeftPartFactory<S extends IOrderListSettings | IOrderHistorySettings>(
  titleKey: string,
) {
  type IProps = IHeaderLeftPartWithSettingsProps<S> & ITranslateProps;

  class HeaderLeftPart extends React.PureComponent<IProps> {

    public render() {
      const { settings: { hideOtherPairs }, translate: t } = this.props;

      return (
        <div className={b()}>
          <WidgetTitle>{t(titleKey)}</WidgetTitle>
          <div className={b('hide-checkbox').mix(notDraggableClassName)()}>
            <Checkbox
              onChange={this.handleHideOtherPairsCheckboxChange}
              checked={Boolean(hideOtherPairs)}
              label={t('ORDERS:HEADER-LEFT-PART:HIDE-OTHER-PAIRS-LABEL')}
            />
          </div>
        </div>
      );
    }

    @bind
    private handleHideOtherPairsCheckboxChange() {
      const { onSettingsSave, settings } = this.props;
      const settingsUpdate: DeepPartial<IOrderListSettings | IOrderHistorySettings> = {
        hideOtherPairs: !settings.hideOtherPairs
      };

      onSettingsSave(settingsUpdate as DeepPartial<S>);
    }
  }

  return i18nConnect(HeaderLeftPart);
}
