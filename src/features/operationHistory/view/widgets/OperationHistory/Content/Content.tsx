import * as React from 'react';
import { bind } from 'decko';

import {
  IOperationHistorySettings, IWidgetContentProps, IOperationHistoryColumnData,
} from 'shared/types/models';
import { ISortInfo } from 'shared/types/ui';

import { OperationHistory } from '../../../containers/';

type IProps = IWidgetContentProps<IOperationHistorySettings>;

class OperationHistoryWidget extends React.PureComponent<IProps> {

  public render() {
    const { settings: { sort } } = this.props;
    return (
      <OperationHistory
        sortInfo={sort}
        onSortInfoChange={this.handleSortInfoChange}
      />
    );
  }

  @bind
  private handleSortInfoChange(sort: ISortInfo<IOperationHistoryColumnData>) {
    const { onSettingsSave } = this.props;
    onSettingsSave({ sort });
  }
}

export default OperationHistoryWidget;
