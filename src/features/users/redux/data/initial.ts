import { initialCommunicationField } from 'shared/helpers/redux';
import { defaultPaginationState } from 'shared/constants';
import { IReduxState } from '../../namespace';

export const initial: IReduxState = {
  communication: {
    loadUsersCommunication: initialCommunicationField,
    resetKycDocumentCommunication: initialCommunicationField,
    getUserDocumentsCommunication: initialCommunicationField,
    updateProfile: initialCommunicationField,
    loadUserRoles: initialCommunicationField,
    activateUser: initialCommunicationField,
    deactivateUser: initialCommunicationField,
    verifyUser: initialCommunicationField,
    unlockUser: initialCommunicationField,
    confirmEmail: initialCommunicationField,
    deleteUserClaim: initialCommunicationField,
    loadOpenOrders: initialCommunicationField,
    loadUserBalance: initialCommunicationField,
    loadUserArchiveOrders: initialCommunicationField,
  },
  data: {
    users: [],
    userRoles: [],
    usersBalance: {},
    openOrders: {
      data: [],
      pagination: defaultPaginationState,
    },
    archiveOrders: {
      data: [],
      pagination: defaultPaginationState,
    },
  },
  edit: {
    isUserProfilModaleShown: false,
    currentProfile: null,
    usersTableTotalPages: 1,
  },
};
