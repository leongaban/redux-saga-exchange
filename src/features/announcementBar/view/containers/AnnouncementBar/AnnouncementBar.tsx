import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch, compose } from 'redux';
import block from 'bem-cn';

import { ITranslateProps, i18nConnect } from 'services/i18n';
import { Preloader } from 'shared/view/elements';
import { IAnnouncement } from 'shared/types/models';
import { IAppReduxState } from 'shared/types/app';

import { actions, selectors } from './../../../redux';
import AnnouncementItem from '../../components/AnnouncementItem/AnnouncementItem';

import './AnnouncementBar.scss';

interface IStateProps {
  announcements: IAnnouncement[];
  loading: boolean;
}
interface IActionProps {
  loadAnnouncements: typeof actions.loadAnnouncements;
}

type IProps = IStateProps & IActionProps & ITranslateProps;

function mapState(state: IAppReduxState): IStateProps {
  return {
    announcements: selectors.selectAnnouncements(state),
    loading: selectors.selectAnnouncementsLoading(state)
  };
}

function mapDispatch(dispatch: Dispatch<IAppReduxState>): IActionProps {
  return bindActionCreators({
    loadAnnouncements: actions.loadAnnouncements
  }, dispatch);
}

const b = block('announcement-bar');

class AnnoucementBar extends React.PureComponent<IProps> {

  public componentDidMount() {
    this.props.loadAnnouncements();
  }

  public render() {
    const {
      announcements,
      loading,
      translate: t,
    } = this.props;
    return (
      <div className={b('wrapper')()}>
        {
          loading && <Preloader size={1.2} type="button" isShow={true}/>}
        {!loading && announcements.length > 0 && <ul className={b('items')()}>
          {announcements.map((item, key) => <li key={key} className={b('item')()}>
            <AnnouncementItem data={item} />
            </li>)}
          {/* Empty items for proper flexbox column layouting */}
          { announcements.length >= 4 &&
          <React.Fragment>
            <li className={b('item')()} />
            <li className={b('item')()} />
            <li className={b('item')()} />
          </React.Fragment>
          }
        </ul>}

        {!loading && announcements.length === 0 &&
          <h4 className={b('info')()}>{t('WIDGETS:ANNOUNCEMENTBAR-INFO')}</h4>}
      </div>
    );
  }

}

export default compose(
  connect(mapState, mapDispatch),
  i18nConnect
)(AnnoucementBar);
