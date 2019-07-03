export interface ISavePersonalInfoRequest {
  email: string;
  nickname: string;
  firstName: string;
  middleName: string;
  lastName: string;
  address: string;
  city: string;
  countryId?: string;
  postCode?: string;
}
