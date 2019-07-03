import React from 'react';
import block from 'bem-cn';
import { connect } from 'react-redux';
import { bind } from 'decko';
import { bindActionCreators, Dispatch } from 'redux';
import { IAppReduxState } from 'shared/types/app';

import { Table, ITableRecordsPerPageSelectConfig } from 'shared/view/components';
import {
  IUserTableColumns,
  IUserTableColumnData,
  IAdminPanelUser,
  IUser,
  // AccountType, // TODO: add uncomment it before next release, when BE will be ready
} from 'shared/types/models';
import { ISortInfo } from 'shared/types/ui';
import { selectors as userServiceSelectors } from 'services/user/redux';

import { actions, selectors } from '../../../redux';
import {
  NicknameCell,
  StatusCell,
  DateOfCreationCell,
  ActionsCell,
  CountryCell,
} from '../../components/TableCells/TableCells';
import './UsersTable.scss';

// TODO: add uncomment it before next release, when BE will be ready
// const translatedAccountTypes = {
//   [AccountType.notSet]: 'Not set',
//   [AccountType.individual]: 'Individual',
//   [AccountType.business]: 'Business',
// };

const userColumns: IUserTableColumns = {
  email: {
    title: () => 'Email',
    isSortable: false,
    width: 15,
  },
  roles: {
    title: () => 'Role',
    isSortable: false,
    renderCell: (record: IAdminPanelUser) => <span>{record.roles.join(' ,')}</span>,
  },
  isVerified: {
    title: () => 'Status',
    renderCell: StatusCell,
    isSortable: false,
  },
  nickname: {
    title: () => 'Nickname',
    renderCell: NicknameCell,
    isSortable: false,
    width: 15,
  },
  // TODO: add uncomment it before next release, when BE will be ready
  // accountType: {
  //   title: () => 'Account Type',
  //   renderCell: (record: IAdminPanelUser) =>
  //     translatedAccountTypes[record.accountType],
  //   isSortable: false
  // },
  country: {
    title: () => 'Country',
    renderCell: CountryCell,
    isSortable: false,
  },
  dateCreated: {
    title: () => 'Created',
    renderCell: DateOfCreationCell,
    isSortable: false,
  },
};

const TableUsers = Table as new () => Table<IUserTableColumnData, IAdminPanelUser, 'actions'>;

interface IOwnProps {
  activePage: number;
  onPageRequest(page: number, perPage: number): void;
}

interface IStateProps {
  users: IAdminPanelUser[];
  totalPages: number;
  isRequesting: boolean;
  currentUser: IUser | null;
}

interface IActionProps {
  setCurrentUserProfile: typeof actions.setCurrentUserProfile;
  setUserProfileModalState: typeof actions.setUserProfileModalState;
  loadUserRoles: typeof actions.loadUserRoles;
  activateUser: typeof actions.activateUser;
  deactivateUser: typeof actions.deactivateUser;
}

function mapState(state: IAppReduxState): IStateProps {
  return {
    users: selectors.selectUsers(state),
    totalPages: selectors.selectUsersTableTotalPages(state),
    isRequesting: selectors.selectCommunication(state, 'loadUsersCommunication').isRequesting,
    currentUser: userServiceSelectors.selectUser(state),
  };
}

function mapDispatch(dispatch: Dispatch<IAppReduxState>): IActionProps {
  return bindActionCreators(actions, dispatch);
}

type IProps = IStateProps & IOwnProps & IActionProps;

const sortInfo: ISortInfo<IUserTableColumnData> = {
  column: 'dateCreated',
  direction: 'descend',
  kind: 'date',
};

const recordsPerPageSelectConfig: ITableRecordsPerPageSelectConfig = {
  initialOption: 20,
  options: [20, 30, 50, 100],
};

const b = block('users-table');

class UsersTable extends React.PureComponent<IProps> {
  public componentDidMount() {
    const { loadUserRoles } = this.props;
    loadUserRoles();
  }

  public render() {
    const { onPageRequest, totalPages, isRequesting, activePage } = this.props;

    return (
      <TableUsers
        columns={userColumns as any}
        records={this.props.users as any}
        minWidth={70}
        sortInfo={sortInfo}
        recordsPerPageSelectConfig={recordsPerPageSelectConfig}
        extraColumns={{
          actions: {
            title: () => 'Actions',
            isSortable: false,
            width: 10.5,
            renderCell: this.renderActions,
          },
        }}
        shouldShowNumericPaginationControls
        recordIDColumn="id"
        renderHeader={this.renderHeader}
        serverPaginationProps={{ onPageRequest, isRequesting, totalPages, activePage }}
      />
    );
  }

  @bind
  private renderHeader(renderPaginationControls: () => JSX.Element | null) {
    return (
      <div className={b('header')()}>
        {renderPaginationControls()}
      </div>
    );
  }

  @bind
  private renderActions(record: IAdminPanelUser) {
    const handleToggleModal = this.makeToggleModalHandler(record);
    const handleChangeUserStatus = this.makeChangeUserStatusHandler(record);

    const { currentUser } = this.props;
    const isCurrentUserSupport = currentUser ? currentUser.roles.includes('Support') : false;
    const isEditedUserAdmin = record.roles.includes('Admin');

    return (
      <ActionsCell
        toggleModal={handleToggleModal}
        changeStatus={handleChangeUserStatus}
        record={record}
        isActivationDisabled={isCurrentUserSupport && isEditedUserAdmin}
      />
    );
  }

  @bind
  private makeChangeUserStatusHandler(record: IAdminPanelUser) {
    const { activateUser, deactivateUser } = this.props;
    const { isActive, id } = record;
    return isActive ? () => deactivateUser(id) : () => activateUser(id);
  }

  @bind
  private makeToggleModalHandler(record: IAdminPanelUser) {
    return () => {
      this.props.setCurrentUserProfile(record);
      this.props.setUserProfileModalState(true);
    };
  }
}

export default connect(mapState, mapDispatch)(UsersTable);
