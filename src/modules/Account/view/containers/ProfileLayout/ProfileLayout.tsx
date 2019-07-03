import * as React from 'react';

import * as features from 'features';
import { featureConnect } from 'core';
import { Preloader } from 'shared/view/elements';

import AccountLayout from '../AccountLayout/AccountLayout';

interface IOwnProps {
  profileFeature: features.profile.Entry;
}

type IProps = IOwnProps;

class ProfileLayout extends React.PureComponent<IProps> {

  public render() {
    const { profileFeature } = this.props;
    const { containers: { PersonalDataForm } } = profileFeature;

    return (
      <AccountLayout>
        <PersonalDataForm />
      </AccountLayout>
    );
  }
}

export default (
  featureConnect({
    profileFeature: features.profile.loadEntry,
  }, <Preloader isShow />)(
    ProfileLayout
  ));
