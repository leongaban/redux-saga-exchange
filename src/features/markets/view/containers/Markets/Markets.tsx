import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { bind } from 'decko';
import block from 'bem-cn';

import { IAppReduxState } from 'shared/types/app';
import { IMarket } from 'shared/types/models';
import { Input } from 'shared/view/elements';

import { actions, selectors } from '../../../redux';
import { EditMarketModal } from '../../components';
import MarketsTable from '../MarketsTable/MarketsTable';
import { IEditMarketForm } from '../../../namespace';
import './Markets.scss';

const b = block('markets');

interface IStateProps {
  currentMarket: IMarket | null;
  isEditMarketModalShown: boolean;
}

interface IState {
  filter?: string;
}

interface IActionProps {
  load: typeof actions.load;
  editMarket: typeof actions.editMarket;
  setCurrentMarket: typeof actions.setCurrentMarket;
  setEditMarketModalState: typeof actions.setEditMarketModalState;
  reset: typeof actions.reset;
}

type IProps = IStateProps & IState & IActionProps;

function mapState(state: IAppReduxState): IStateProps {
  return {
    currentMarket: selectors.selectCurrentMarket(state),
    isEditMarketModalShown: selectors.selectIsEditMarketModalShown(state),
  };
}

function mapDispatch(dispatch: Dispatch<IAppReduxState>): IActionProps {
  return bindActionCreators(actions, dispatch);
}

class MarketsFeature extends React.PureComponent<IProps, IState> {

  public state: IState = {
    filter: '',
  };

  public componentDidMount() {
    this.props.load();
  }

  public componentWillUnmount() {
    this.props.reset();
  }

  public render() {
    const { isEditMarketModalShown } = this.props;
    return (
      <div className={b()}>
        <div className={b('controls')()}>
          <div className={b('search')()} >
            <Input
              search
              extent="middle"
              onChange={this.handleSearchInputChange}
              placeholder="Find Market"
            />
          </div>
        </div>
        <div className={b('table')()}>
          <MarketsTable filter={this.state.filter} />
        </div>
        {isEditMarketModalShown && this.renderEditMarketModal()}
      </div>
    );
  }

  @bind
  private renderEditMarketModal() {
    const { isEditMarketModalShown, currentMarket } = this.props;
    return (
      <EditMarketModal
        isModalOpen={isEditMarketModalShown}
        market={currentMarket}
        onClose={this.handleEditMarketModalClose}
        onSubmit={this.handleEditMarketSubmit}
      />
    );
  }

  @bind
  private handleEditMarketModalClose() {
    this.props.setCurrentMarket(null);
    this.props.setEditMarketModalState(false);
  }

  @bind
  private handleEditMarketSubmit(values: IEditMarketForm) {
    this.props.editMarket({
      id: values.id,
      makerFee: values.makerFee !== undefined ? +values.makerFee : undefined,
      takerFee: values.takerFee !== undefined ? +values.takerFee : undefined,
      baseFee: values.baseFee !== undefined ? +values.baseFee : undefined,
      quoteFee: values.quoteFee !== undefined ? +values.quoteFee : undefined,
      priceScale: values.priceScale !== undefined ? +values.priceScale : undefined,
      amountScale: values.amountScale !== undefined ? +values.amountScale : undefined,
      minOrderValue: values.minOrderValue !== undefined ? +values.minOrderValue : undefined,
      minTradeAmount: values.minTradeAmount !== undefined ? +values.minTradeAmount : undefined,
      hidden: values.hidden,
    });
  }

  @bind
  private handleSearchInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ filter: event.target.value });
  }
}

export default connect(mapState, mapDispatch)(MarketsFeature);
