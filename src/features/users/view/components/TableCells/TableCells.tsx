import React from 'react';
import moment from 'services/moment';
import block from 'bem-cn';

import { Button } from 'shared/view/elements';

import { IAdminPanelUser } from 'shared/types/models';

import './TableCells.scss';
const b = block('users-table-cell');

interface IActionsCellProps {
  record: IAdminPanelUser;
  isActivationDisabled: boolean;
  toggleModal?: () => void;
  changeStatus?: () => void;
}

export const NicknameCell = (record: IAdminPanelUser) => {
  const { firstName, middleName, lastName } = record;
  return (
    <div className={b('cell-container')()}>
      <span>
        {record.nickname}
      </span>
      <span className={b('sub-text')()}>
        {`${firstName ? firstName : ''} ${middleName ? middleName : ''} ${lastName ? lastName : ''}`}
      </span>
    </div>
  );
};

export const StatusCell = (record: IAdminPanelUser) => {
  const verifiedUser = b('verified')();
  const notVerifiedUser = b('not-verified')();
  return (
    <div className={b('cell-container')()}>
      <span className={record.isVerified ? verifiedUser : notVerifiedUser}>
        {record.isVerified ? 'Verified' : 'Not Verified'}
      </span>
      <span className={b('sub-text')()}>
        {record.isActive ? 'Active' : 'Inactive'}
      </span>
    </div>
  );
};

export const DateOfCreationCell = (record: IAdminPanelUser) => {
  return (
    <div className={b('cell-container')()}>
      <span>
        {moment(record.dateCreated).format('DD.MM.YYYY H:m')}
      </span>
    </div>
  );
};

export const CountryCell = (record: IAdminPanelUser) => {
  const { country } = record;
  return (
    <span>{country ? country.name : '—'}</span>
  );
};

export const ActionsCell = ({ toggleModal, record, changeStatus, isActivationDisabled }: IActionsCellProps) => {
  return (
    <div className={b('actions')()}>
      <div className={b('button')()}>
        <Button size="small" color="text-blue" onClick={toggleModal}>
          View
        </Button>
      </div>
      <div className={b('button')()}>
        <Button
          size="small"
          color={record.isActive ? 'text-red' : 'text-green'}
          onClick={changeStatus}
          disabled={isActivationDisabled}
        >
          {record.isActive ? 'Deactivate' : 'Activate'}
        </Button>
      </div>
    </div>
  );
};
