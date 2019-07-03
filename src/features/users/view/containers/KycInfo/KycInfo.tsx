import React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import block from 'bem-cn';
import { bind } from 'decko';

import { IAdminPanelUser } from 'shared/types/models';
import { reduxForm, InjectedFormProps } from 'redux-form';
import { LinedSection } from 'shared/view/components';
import { IAppReduxState } from 'shared/types/app';
import { Button, Preloader } from 'shared/view/elements';
import { documentTypes, documentTypeNames } from 'services/user/constants';
import { ITranslateProps, i18nConnect } from 'services/i18n';

import DocumentItem from '../../components/DocumentItem/DocumentItem';
import { reduxFormEntries, actions, selectors } from '../../../redux';
import * as NS from '../../../namespace';

import './KycInfo.scss';

const b = block('kyc-info');

interface IOwnProps {
  currentUserProfile: IAdminPanelUser;
}

interface IStateProps {
  isResetDocRequesting: boolean;
  isGetDocRequesting: boolean;
}

interface IActionProps {
  verifyUser: typeof actions.verifyUser;
  resetKycDocument: typeof actions.resetKycDocument;
  getUserDocuments: typeof actions.getUserDocuments;
}

function mapState(state: IAppReduxState): IStateProps {
  return {
    isResetDocRequesting: selectors.isRequestingResetKycDocument(state),
    isGetDocRequesting: selectors.isRequestingGetDocument(state),
  };
}

function mapDispatch(dispatch: Dispatch<IAppReduxState>): IActionProps {
  return bindActionCreators(actions, dispatch);
}

type IProps = IStateProps & IActionProps & IOwnProps & InjectedFormProps<NS.IUsersForm, IOwnProps> & ITranslateProps;

const { usersFormEntry: { name } } = reduxFormEntries;

class KycInfo extends React.PureComponent<IProps> {

  public componentDidMount() {
    const { getUserDocuments, currentUserProfile } = this.props;
    getUserDocuments(currentUserProfile.id);
  }

  public render() {
    const { currentUserProfile: { documents, isVerified }, isGetDocRequesting } = this.props;

    return (
      <div className={b()}>
        <LinedSection withBorder title="Documents">
          <Preloader isShow={isGetDocRequesting} />
          <ul className={b('list')()}>
            {documents ?
              Object.keys(documents)
                .map(this.renderDocumentTypeSection) : null
            }
          </ul>
        </LinedSection>
        <LinedSection withBorder>
          <div className={b('verify-user-button')()}>
            <Button type="button" color="blue" onClick={this.handleVerifyUser}>
              {isVerified ? 'unverify user' : 'verifiy user'}
            </Button>
          </div>
        </LinedSection>
      </div>
    );
  }

  @bind
  private renderDocumentTypeSection(key: string) {
    const { currentUserProfile: { documents }, isResetDocRequesting, translate: t } = this.props;
    const type = Number(key);
    const documentsList = documents![type];

    return documentsList.length === 0 ?
      null :
      (
        <li key={type}>
          <p className={b('category')()}>{t(documentTypeNames[type])}</p>
          {documentsList.map((document) => (
            <DocumentItem
              onReset={type === documentTypes.kycForm ? this.handleReset : undefined}
              document={document}
              key={document.url}
              isRequesting={isResetDocRequesting}
            />
          ))}
        </li>
      );
  }

  @bind
  private handleVerifyUser() {
    const { currentUserProfile, verifyUser } = this.props;
    verifyUser(currentUserProfile.isVerified);
  }

  @bind
  private handleReset(documentId: string) {
    const { currentUserProfile: { id }, resetKycDocument } = this.props;
    resetKycDocument({ userId: id, documentId });
  }
}

export default reduxForm<NS.IUsersForm, IOwnProps>({
  form: name,
  onSubmit: (formValues, dispatch) => {
    dispatch(actions.updateUserProfile(formValues as NS.IUsersForm));
  },
})(
  connect(mapState, mapDispatch)(i18nConnect(KycInfo)),
);
