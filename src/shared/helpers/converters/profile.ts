
import {
  IServerProfile,
  ICountry,
  IUser,
  IPersonalDataForm,
  IServerKycDocument,
  IKycDocument,
  IServerApiKey,
  IApiKey,
  IServerDocument,
  IDocuments,
  ISingleDocument
} from 'shared/types/models';
import { convertCountry } from './common';
import { ISavePersonalInfoRequest } from 'shared/types/requests';
import { ACCOUNT } from 'shared/constants';
import { documentTypes, documentTypeNames } from 'services/user/constants';

export const convertKycDocuments = (responseDocuments: IServerKycDocument[]): IKycDocument[] =>
  responseDocuments.map(document => ({
    id: document.template_id,
    name: document.name,
    isCompleted: false,
    url: '',
    type: String(document.document_type) === ACCOUNT.INDIVIDUAL ? ACCOUNT.INDIVIDUAL : ACCOUNT.BUSINESS
  })
  );

const convertDocument = (document: IServerDocument): ISingleDocument => ({
  templateId: document.template_id,
  id: document.unique_name,
  name: document.name,
  url: document.link,
  type: document.type ? document.type : documentTypes.other
});

export const convertDocumentsList = (response?: IServerDocument[]): IDocuments => {
  if (!response) {
    return {};
  }

  const groupsOfDocuments = Object.keys(documentTypeNames)
    .reduce((acc: IDocuments, type) => ({
      ...acc,
      [type]: response
        .filter(doc => `${doc.type}` === type)
        .map(convertDocument),
    }), {});

  return groupsOfDocuments;
};

export function convertProfile(data: IServerProfile): IUser {
  return {
    id: data.id,
    email: data.email,
    nickname: data.nickname,
    firstName: data.first_name || '',
    middleName: data.middle_name || '',
    lastName: data.last_name || '',
    roles: data.roles || [],
    isVerified: data.is_verified,
    address: data.address || '',
    city: data.city || '',
    country: isCountry(data.country) ? convertCountry(data.country) : null,
    postCode: data.post_code || '',
    avatarUrl: data.image_url || '',
    kycDocuments: convertKycDocuments(data.kyc_documents || []),
    documents: convertDocumentsList(data.documents || []),
    affiliateId: data.affiliate_id,
    referralId: data.referral_id,
  };
}

function isCountry(data: ICountry | {}): data is Partial<ICountry> {
  const country = data as ICountry;
  return Boolean(country && country.id);
}

export function convertSavePersonalProfileRequest(data: IPersonalDataForm): ISavePersonalInfoRequest {
  const request = {
    email: data.email,
    nickname: data.nickname,
    firstName: data.firstName,
    middleName: data.middleName,
    lastName: data.lastName,
    address: data.address,
    city: data.city,
    postCode: data.postCode
  };
  if (data.country) {
    return { ...request, countryId: data.country.id };
  }
  return request;
}

export function transfromApiKey(key: IServerApiKey): IApiKey {
  return {
    name: key.name,
    publicKey: key.publicKey,
    isReadAccess: !!key.isInfo,
    isTrading: !!key.isTrade,
    isWithdrawal: !!key.isWithdraw,
    ipAddressList: key.ipWhiteList || [],
    privateKey: key.privateKey || ''
  };
}
