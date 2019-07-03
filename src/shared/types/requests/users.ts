export type UsersFilter = 'all' | 'verified' | 'unverified' | 'admins';

export interface ILoadUsersRequest {
  page: number;
  perPage: number;
  filter: UsersFilter;
  search?: string;
}
