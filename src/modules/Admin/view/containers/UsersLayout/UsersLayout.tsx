import React from 'react';
import block from 'bem-cn';
import { featureConnect } from 'core';
import { bind, debounce } from 'decko';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { bindActionCreators } from 'redux';

import * as usersFeatureEntry from 'features/users';
import { UsersFilter } from 'shared/types/requests';
import { ITableRecordsPerPageSelectConfig } from 'shared/view/components';
import { Preloader, Input } from 'shared/view/elements';
import { Action } from 'shared/types/redux';

import UsersFilters from '../../components/UsersFilters/UsersFilters';
import AdminLayout from '../AdminLayout/AdminLayout';
import './UsersLayout.scss';

const b = block('users-layout');

interface IFeatureProps {
  usersFeatureEntry: usersFeatureEntry.Entry;
}

interface IActionProps {
  loadUsers: Action<usersFeatureEntry.namespace.ILoadUsers>;
}

type IProps = IFeatureProps & IActionProps & RouteComponentProps<{ filter?: UsersFilter }>;

interface IState {
  page: number;
  perPage: number;
  search: string;
}

const tableRecordsPerPageSelectConfig: ITableRecordsPerPageSelectConfig = {
  initialOption: 20,
  options: [20, 30, 50, 100],
};

function mapDispatch(dispatch: Dispatch<any>, props: IFeatureProps): IActionProps {
  return bindActionCreators(props.usersFeatureEntry.actions, dispatch);
}

class Users extends React.PureComponent<IProps, IState> {

  public state: IState = {
    page: 1,
    perPage: tableRecordsPerPageSelectConfig.initialOption,
    search: '',
  };

  private get filter() {
    return (this.props.match.params.filter || 'all') as UsersFilter;
  }

  public componentDidMount() {
    this.loadUsers();
  }

  public componentDidUpdate(prevProps: IProps) {
    if (this.props.match.params.filter !== prevProps.match.params.filter) {
      this.loadUsers();
    }
  }

  public render() {
    const { UsersTable, UserProfile } = this.props.usersFeatureEntry.containers;

    return (
      <AdminLayout>
        <div className={b()}>
          <UsersFilters onNavLinkClick={this.handleNavLinkClick} />
          <div className={b('table-section')()} >
            <div className={b('search-form')()} >
              <div className={b('search-input')()}>
                <Input
                  search
                  placeholder="Search"
                  extent="middle"
                  value={this.state.search}
                  onChange={this.handleSearchInputChange}
                />
              </div>
            </div>
            <div className={b('users-table')()} >
              <UsersTable
                onPageRequest={this.handlePageRequest}
                activePage={this.state.page}
              />
            </div>
            <UserProfile />
          </div>
        </div>
      </AdminLayout>
    );
  }

  @bind
  private handlePageRequest(page: number, perPage: number) {
    this.setState(() => ({ page, perPage }), this.loadUsers);
  }

  @bind
  private handleSearchInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.persist();
    this.setState(() => ({ search: event.target.value, page: 1 }), this.debouncedLoadUsersRequest);
  }

  @bind
  private handleNavLinkClick() {
    this.setState(() => ({ page: 1 }), this.loadUsers);
  }

  @bind
  @debounce(1000)
  private debouncedLoadUsersRequest() {
    this.loadUsers();
  }

  @bind
  private loadUsers() {
    const { loadUsers } = this.props;
    const { page, perPage, search } = this.state;
    loadUsers({ page, perPage, search, filter: this.filter });
  }
}

export default withRouter((
  featureConnect({
    usersFeatureEntry: usersFeatureEntry.loadEntry,
  }, <Preloader isShow />)(
    connect(null, mapDispatch)(
      Users,
    ))));
