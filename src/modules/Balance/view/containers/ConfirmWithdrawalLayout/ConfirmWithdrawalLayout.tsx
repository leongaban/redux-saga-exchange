import * as React from 'react';
import { parse } from 'query-string';
import { withRouter, RouteComponentProps } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

import { featureConnect } from 'core';
import * as features from 'features';
import * as protectorService from 'services/protector';
import { Preloader } from 'shared/view/elements';
import { Action } from 'shared/types/redux';
import { IVerifyWithdrawCoinsRequest } from 'shared/types/requests';

import { routes } from '../../../constants';

interface IOwnProps {
  balanceEntry: features.balance.Entry;
}

interface IActionProps {
  withdrawCoinsVerify: Action<features.balance.namespace.IWithdrawCoinsVerify>;
  setCodeFieldValue: Action<protectorService.namespace.ISetCodeFieldValue>;
  toggleVerificationModalState(): void;
}

type IProps = IOwnProps & IActionProps & RouteComponentProps<{}>;

function mapDispatch(dispatch: Dispatch<any>, featureProps: IOwnProps): IActionProps {
  return bindActionCreators({
    withdrawCoinsVerify: featureProps.balanceEntry.actions.withdrawCoinsVerify,
    loadDepositAddress: featureProps.balanceEntry.actions.loadDepositAddress,
    setModalProps: featureProps.balanceEntry.actions.setModalProps,
    toggleVerificationModalState: protectorService.actions.toggleVerificationModalState,
    setCodeFieldValue: protectorService.actions.setCodeFieldValue,
  }, dispatch);
}

function isWithdrawRequestWithCode(x: any): x is (IVerifyWithdrawCoinsRequest & { code: string }) {
  const y = x as (IVerifyWithdrawCoinsRequest & { code: string });
  // validation of other properties are not necessery, because in app we using only these one
  return y.code !== void 0;
}

class ConfirmWithdrawalLayout extends React.PureComponent<IProps> {
  public componentDidMount() {
    const params = parse(this.props.location.search);
    if (Object.keys(params).length > 0) {
      if (isWithdrawRequestWithCode(params)) {
        const { code, ...request } = params;
        this.props.setCodeFieldValue(code);
        this.props.withdrawCoinsVerify(request);
        this.props.history.push(routes.balance.getPath());
      } else {
        console.warn('unexpected query string params for balance page', params);
      }
    }
  }

  public render() {
    return null;
  }
}

export default (
  featureConnect({
    balanceEntry: features.balance.loadEntry,
  }, <Preloader isShow />)(
    withRouter(
      connect(null, mapDispatch)(
        ConfirmWithdrawalLayout
      ))));
