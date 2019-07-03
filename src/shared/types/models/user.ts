import { ACCOUNT } from 'shared/constants';

import { TableColumns } from '../ui';
import { Role } from './common';
import { ICountry, IImageFile } from '.';

export interface IKycDocument {
  id: string;
  name: string;
  isCompleted: boolean;
  url: string;
  type: string;
}

export interface ISingleDocument {
  id: string;
  name: string;
  url: string;
  type: number;
  templateId: string;
}

export interface IDocuments {
  [key: number]: ISingleDocument[];
}

export interface IServerKycDocument {
  document_template_id: number;
  template_id: string;
  name: string;
  is_enabled: boolean;
  document_type: ACCOUNT;
}

export interface IBasicUser {
  id: string;
  email: string;
  nickname: string;
  firstName: string;
  middleName: string;
  lastName: string;
  roles: Role[];
  country: ICountry | null;
  isVerified: boolean;
  documents?: IDocuments;
  avatarUrl: string;
}

export interface IUser extends IBasicUser {
  documents: IDocuments;
  address: string;
  city: string;
  postCode?: string;
  kycDocuments: IKycDocument[];
  affiliateId: string;
  referralId: string;
}

export interface IAdminPanelUser extends IBasicUser {
  dateCreated: string;
  isActive: boolean;
  isEmailConfirmed: boolean;
  isPhoneConfirmed: boolean;
  canDeposit: boolean;
  canWithdraw: boolean;
  lockoutEnd: string;
  twoFactorEnabled: boolean;
  claims: IClaim[];
  accountType: AccountType;
  affiliateId: string;
  referralId: string;
}

export interface IServerDocument {
  unique_name: string;
  name: string;
  link: string;
  link_expires_at: string;
  template_id: string;
  type: number;
  status: string;
}

export interface IServerProfile {
  id: string;
  email: string;
  nickname: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  roles: Role[];
  is_verified: boolean;
  address: string;
  city: string;
  post_code?: string;
  country: Partial<ICountry> | {}; // may be empty object if not set
  image_url?: string;
  documents?: IServerDocument[];
  kyc_documents: IServerKycDocument[];
  affiliate_id: string;
  referral_id: string;
}

export interface ISecretInfo {
  secretCode: string;
  qrCode: string;
  is2FAEnabled: boolean;
}

export interface IUserTableColumnData {
  email: string;
  roles: Role[];
  isVerified: boolean;
  nickname: string;
  country: ICountry;
  dateCreated: string;
  // accountType: AccountType; // TODO: add uncomment it before next release, when BE will be ready
}

export interface IClaim {
  id: number;
  type: string;
  value: string;
}

export const enum AccountType {
  notSet,
  individual,
  business
}

export interface IServerAdminUser {
  id: string;
  email: string;
  is_active: boolean;
  is_verified: boolean;
  first_name: string;
  last_name: string;
  middle_name: string;
  nickname: string;
  date_created: string;
  country: ICountry;
  postCode?: string;
  image_url: string;
  roles: Role[];
  documents: IServerDocument[];
  can_deposit: boolean;
  can_withdraw: boolean;
  is_email_confirmed: boolean;
  is_phone_confirmed: boolean;
  lockout_end: string;
  two_factor_enabled: boolean;
  claims: IClaim[];
  account_type: AccountType;
  affiliate_id: string;
  referral_id: string;
}

export type IUserTableColumns = TableColumns<IUserTableColumnData, IAdminPanelUser>;

export interface IPersonalDataForm {
  avatar: IImageFile;
  email: string;
  nickname: string;
  firstName: string;
  middleName: string;
  lastName: string;
  address: string;
  city: string;
  country: ICountry;
  postCode: string;
  documents: IDocuments;
}

export interface IServerAdminUsersResponse {
  filters: {
    search: string;
  };
  paging: {
    page: number;
    per_page: number;
    total: number;
  };
  data: IServerAdminUser[];
}

export interface IUserRole {
  id: string;
  name: Role;
  normalizedName: string;
  concurrencyStamp: string;
}
