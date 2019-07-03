import React from 'react';
import * as block from 'bem-cn';
import { bind } from 'decko';

import { Icon } from 'shared/view/elements';
import { exportToXLS } from 'shared/helpers/exportToXLS';

import './ExportToXLSXButton.scss';

interface IProps<T> {
  filename: string;
  data: T[];
}

const b = block('export-to-xlsx-button');

class ExportToXLSXButton<T>  extends React.PureComponent<IProps<T>>  {
  public render() {
    return (
      <div
        className={b()}
        title="Export to XLSX file"
        onClick={this.handleExportToXLSXButtonClick}
      >
        <Icon className={b('icon')()} src={require('./img/export-inline.svg')} />
      </div>
    );
  }

  @bind
  private handleExportToXLSXButtonClick() {
    const { data, filename } = this.props;
    exportToXLS(data, filename);
  }
}

export default ExportToXLSXButton;
