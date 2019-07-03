import { bind } from 'decko';
import BaseApi from './Base';
import {
  ISecretInfo,
  IServerProfile,
  IUser,
  IPersonalDataForm,
  IServerApiKey,
  IApiKey,
  ICreateApiKeyRequest,
  ISingleDocument,
  IServerDocument,
  IDocuments,
  IKycDocument,
  IServerKycDocument,
  IImageFile
} from 'shared/types/models';
import {
  convertProfile,
  convertSavePersonalProfileRequest,
  convertDocumentsList,
  convertKycDocuments,
  transfromApiKey
} from 'shared/helpers/converters';

import * as converters from './converters';
import {
  ISecretInfoResponse,
  I2FASetupRequest,
  IGetDocumentResponse,
} from './types';
import { documentTypes } from 'services/user/constants';

class ProfileApi extends BaseApi {

  @bind
  public async getUserProfile(): Promise<IUser> {
    const response = await this.actions.get<{ data: IServerProfile }>(`/frontoffice/backoffice/user`);
    return convertProfile(response.data.data);
  }

  @bind
  public async savePersonalInfo(data: IPersonalDataForm): Promise<void> {
    await this.actions.put(
      `/frontoffice/backoffice/user`,
      convertSavePersonalProfileRequest(data),
      {},
      {},
    );
  }

  @bind
  public async uploadImage(file: IImageFile, setUploadProgress: (progress: number) => void): Promise<string> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    const response = await this.actions.post<{ data: IServerDocument }>(
      'frontoffice/file/images',
      formData,
      {
        onUploadProgress: (progressEvent: ProgressEvent) => {
          const percent = (progressEvent.loaded / progressEvent.total) * 100;
          setUploadProgress(percent);
        },
      } as any,
    );
    return response.data.data.link;
  }

  @bind
  public async uploadDocument(
    data: File,
    type: number,
    setUploadProgress: (progress: number) => void
  ): Promise<ISingleDocument> {
    const formData = new FormData();
    formData.append('file', data);
    const response = await this.actions.post<{ data: IServerDocument[] }>(
      `frontoffice/file/documents/${type}`,
      formData,
      {
        onUploadProgress: (progressEvent: ProgressEvent) => {
          const percent = (progressEvent.loaded / progressEvent.total) * 100;
          setUploadProgress(percent);
        },
      } as any,
    );
    const responseDetails = response.data.data[0];
    const result = {
      id: responseDetails.unique_name,
      templateId: responseDetails.template_id,
      name: responseDetails.name,
      type: responseDetails.type,
      url: responseDetails.link
    };
    return result;
  }

  @bind
  public async removeDocument(id: string): Promise<void> {
    await this.actions.del(
      `frontoffice/file/documents?uniqueFileName=${id}`, {}, {}, {},
    );
  }

  @bind
  public async getDocument(documentId: string): Promise<string> {
    const response = await this.actions.post<IGetDocumentResponse>(
      `/frontoffice/panda-doc/${documentId}`
    );
    return response.data.data.link;
  }

  @bind
  public async fetchDocuments(): Promise<
    { documents: IDocuments, kycDocuments: IKycDocument[], avatarLink: string }
    > {
    const documentsRequest = this.actions.get<{ data: IServerDocument[] }>(
      `/frontoffice/backoffice/user/documents`
    );
    const pandaRequest = this.actions.get<{ data: IServerKycDocument[] }>(
      `/frontoffice/panda-doc/templates`
    );

    const [documentsResponse, pandaResponse] = await Promise.all([documentsRequest, pandaRequest]);
    const avatarDoc = documentsResponse.data.data
      .reverse()
      .find(doc => doc.type === documentTypes.avatar);
    return {
      documents: convertDocumentsList(documentsResponse.data.data),
      kycDocuments: convertKycDocuments(pandaResponse.data.data),
      avatarLink: avatarDoc ? avatarDoc.link : ''
    };
  }

  @bind
  public async loadSecretInfo(): Promise<ISecretInfo> {
    const response = await this.actions.get<ISecretInfoResponse>('frontoffice//api/profile/2fa');
    return converters.convertSecretInfoResponse(response.data);
  }

  @bind
  public async setup2fa(request: I2FASetupRequest): Promise<ISecretInfo> {
    const response = await this.actions.put<ISecretInfoResponse>('frontoffice//api/profile/2fa', request, {}, {});
    return converters.convertSecretInfoResponse(response.data);
  }

  @bind
  public async fetchApiKeys(): Promise<IApiKey[]> {
    const { data } = await this.actions.get<IServerApiKey[]>(
      `/frontoffice/api/key`);
    const keysWithoutSecretKey = data.map(key => {
      const { privateKey, ...restProps } = key;
      return restProps;
    });
    return keysWithoutSecretKey.map(transfromApiKey);
  }

  @bind
  public async addApiKey(payload: ICreateApiKeyRequest): Promise<IApiKey> {
    const { data } = await this.actions.post<IServerApiKey>(
      `/frontoffice/api/key`, payload);
    return transfromApiKey(data);
  }

  @bind
  public async removeApiKey(publicKey: string): Promise<Axios.AxiosXHR<void>> {
    const response = await this.actions.del<void>(
      `/frontoffice/api/key/${publicKey}`, {}, {}, {});
    return response;
  }
}

export default ProfileApi;
