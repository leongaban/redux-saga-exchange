import { takeLatest, call, put, takeEvery, select, all } from 'redux-saga/effects';
import rg4js from 'raygun4js';

import { IUser, ISingleDocument, IKycDocument, IDocuments, IBalanceDict } from 'shared/types/models';
import getErrorMsg from 'shared/helpers/getErrorMsg';
import { IDependencies } from 'shared/types/app';
import { selectors as configSelectors, actions as configActions } from 'services/config';
import { selectors as i18nSelectors, actions as i18nActions } from 'services/i18n';
import resetAppState from 'shared/helpers/redux/resetAppState/resetAppStateAction';
import { UITheme } from 'shared/types/ui';
import { ILocales } from 'services/i18n/namespace';

import * as actions from '../actions';
import * as NS from '../../namespace';

export default function getSaga(deps: IDependencies) {
  const restoreSessionType: NS.IRestoreSession['type'] = 'USER:RESTORE_SESSION';
  const loginType: NS.ILogin['type'] = 'USER:LOGIN';
  const logoutType: NS.ILogout['type'] = 'USER:LOGOUT';
  const loadBalancesType: NS.ILoadBalances['type'] = 'USER:LOAD_BALANCES';
  const restoreAdminSessionType: NS.IRestoreAdminSession['type'] = 'USER:RESTORE_ADMIN_SESSION';
  const getDocumentType: NS.IGetDocument['type'] = 'USER:GET_DOCUMENT';
  const fetchDocumentsType: NS.IFetchDocuments['type'] = 'USER:FETCH_DOCUMENTS';

  function* saga() {
    yield all([
      takeLatest(restoreAdminSessionType, executeRestoreAdminSession, deps),
      takeLatest(logoutType, executeLogout, deps),
      takeLatest(loginType, executeLogin),
      takeLatest(restoreSessionType, executeRestoreSession, deps),
      takeEvery(loadBalancesType, executeLoadBalances, deps),
      takeEvery(getDocumentType, executeGetDocument, deps),
      takeEvery(fetchDocumentsType, executeFetchDocuments, deps),
    ]);
  }

  return saga;
}

export function* executeLogin() {
  yield put(actions.restoreSession());
}

export function* executeLogout({ sockets }: IDependencies) {
  const theme: UITheme = yield select(configSelectors.selectUITheme);
  localStorage.setItem('uiTheme', theme);
  const currentLocale: keyof ILocales = yield select(i18nSelectors.selectCurrentLocale);
  yield put(resetAppState());
  yield put(i18nActions.changeLanguage(currentLocale));
  yield put(configActions.setTheme(theme));
  yield call(sockets.disconnect);
}

export function* executeRestoreSession(deps: IDependencies) {
  try {
    const response: IUser = yield call(deps.api.profile.getUserProfile);
    yield call(deps.sockets.connect);
    rg4js('setUser', {
      identifier: response.email,
      isAnonymous: false,
      email: response.email,
    });

    yield put(actions.restoreSessionCompleted(response));
  } catch (error) {
    const message = getErrorMsg(error);
    yield put(actions.restoreSessionFail(message));
  }
}

const getCompletedDocumentId = (documents: IDocuments, kycDocuments: IKycDocument[]) => {
  let documentId: null | string = null;
  kycDocuments.forEach(kycDocument => {
    Object.values(documents).forEach(
      (docType: ISingleDocument[]) => {
        const document = docType.find(doc => doc.templateId === kycDocument.id);
        if (document) {
          documentId = document.id;
        }
      }
    );
  });
  return documentId;
};

export function* executeFetchDocuments(
  { api }: IDependencies,
  { payload: callback }: NS.IFetchDocuments
) {
  try {
    const { documents, kycDocuments, avatarLink }:
      { documents: IDocuments, kycDocuments: IKycDocument[], avatarLink: string }
      = yield call(api.profile.fetchDocuments);

    const documentId = getCompletedDocumentId(documents, kycDocuments);
    callback(
      documentId === null ? kycDocuments : [],
      documents,
    );
    yield put(actions.updateData({
      kycDocuments: documentId === null ? kycDocuments : [],
      documents,
      avatarUrl: avatarLink
    }));
  } catch (error) {
    const message = getErrorMsg(error);
    yield put(actions.fetchDocumentsFail(message));
  }
}

export function* executeGetDocument({ api }: IDependencies, { payload }: NS.IGetDocument) {
  const { documents, currType } = payload;
  for (const document of documents) {
    if (document.type !== currType) {
      continue;
    }
    try {
      if (!document.url) {
        const url: string = yield call(api.profile.getDocument, document.id);
        yield put(actions.getDocumentSuccess({ id: document.id, url }));
      }
    } catch (error) {
      const message = getErrorMsg(error);
      yield put(actions.getDocumentFail(message));
    }
  }
}

export function* executeRestoreAdminSession(deps: IDependencies) {
  try {
    const userId = yield call(deps.api.auth.restoreAdminSession);
    const user = yield call(deps.api.users.loadUserProfile, userId);

    yield put(actions.restoreAdminSessionSuccess(user));
  } catch (error) {
    const message = getErrorMsg(error);
    yield put(actions.restoreAdminSessionFail(message));
  }
}

function* executeLoadBalances({ api }: IDependencies) {
  try {
    const balances: IBalanceDict = yield call(api.users.loadCurrentUserBalances);
    yield put(actions.loadBalancesCompleted(balances));
  } catch (error) {
    const message = getErrorMsg(error);
    yield put(actions.loadBalancesFailed(message));
  }
}
