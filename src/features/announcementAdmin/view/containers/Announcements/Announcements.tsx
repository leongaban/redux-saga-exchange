import React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import { compose, bindActionCreators } from 'redux';
import { Dispatch, connect } from 'react-redux';
import { change } from 'redux-form';
import { Preloader } from 'shared/view/elements';
import { IAnnouncement } from 'shared/types/models';

import AnnouncementsForm from '../../containers/AnnouncementsForm/AnnouncementsForm';
import AnnouncementsList from '../../components/AnnouncementsList/AnnouncementsList';
import { actions, selectors } from '../../../redux';
import { IAppReduxStateEnrich } from '../../../namespace';

import './Announcements.scss';

interface IStateProps {
  items: IAnnouncement[];
  loading: boolean;
  saving: boolean;
  isSaved: boolean;
  editorContent: string;
  displayWarning: boolean;
}

interface IDispatchProps {
  loadAnnouncements: typeof actions.loadAnnouncements;
  addAnnouncement: typeof actions.addAnnouncement;
  reorderAnnouncement: typeof actions.reorderAnnouncement;
  editAnnouncement: typeof actions.editAnnouncement;
  deleteAnnouncement: typeof actions.deleteAnnouncement;
  showEditModal: typeof actions.showEditModal;
  saveChanges: typeof actions.saveAnnouncement;
  clearForm(): void;
  fillModal(content: string): void;
}

type IProps = IStateProps & IDispatchProps;

const b = block('announcements');

class Announcements extends React.Component<IProps> {
  public componentDidMount() {
    this.props.loadAnnouncements();
  }

  public render() {
    const { loading, displayWarning, saving, isSaved } = this.props;
    return (
        <div className={b()}>
          <div className={b('sector-buttons')()}>
            <AnnouncementsForm
              saveChanges={this.saveChanges}
              addAnnouncement={this.addAnnouncement}
              editAnnouncement={this.editAnnouncement}
              clearModal={this.clearForm}
              saving={saving}
            />
            {
              displayWarning &&
              <p className={b('warning')()}>
                You have made changes inside this view. Use Save option to not lose your work.
              </p>
            }
            {
              isSaved && !displayWarning &&
              <p className={b('info')()}>
                Changes saved successfully!
              </p>
            }
          </div>
          <hr/>
          <div className={b('sector')()}>
            <Preloader position="relative" size={1.2} type="button" isShow={loading}/>
            <AnnouncementsList
              onSortEnd={this.onSortEnd}
              edit={this.edit}
              delete={this.delete}
              items={this.props.items}
              loading={loading}
              distance={2}
            />
          </div>
        </div>
    );
  }

  @bind
  private addAnnouncement() {
    this.props.addAnnouncement(this.props.editorContent);
    this.clearForm();
  }

  @bind
  private editAnnouncement(index: number) {
    this.props.editAnnouncement(index, this.props.editorContent);
    this.clearForm();
  }

  @bind
  private delete(index: number) {
    this.props.deleteAnnouncement(index);
  }

  @bind
  private edit(index: number) {
    this.props.fillModal(this.props.items[index].content);
    this.props.showEditModal(index);
  }

  @bind
  private saveChanges() {
    this.props.saveChanges();
  }

  @bind
  private onSortEnd({oldIndex, newIndex}: {oldIndex: number, newIndex: number}) {
    if (oldIndex !== newIndex) {
      this.props.reorderAnnouncement(oldIndex, newIndex);
    }
  }

  @bind
  private clearForm() {
    this.props.showEditModal(null);
    this.props.clearForm();
  }
}

const mapStateToProps = (state: IAppReduxStateEnrich): IStateProps => {
  return {
    displayWarning: selectors.selectWarning(state),
    items: selectors.selectItems(state),
    loading: selectors.selectLoading(state),
    saving: selectors.selectSaving(state),
    isSaved: selectors.selectSaveState(state),
    editorContent: selectors.selectContent(state)
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): IDispatchProps => {
  return bindActionCreators({
    loadAnnouncements: actions.loadAnnouncements,
    addAnnouncement: actions.addAnnouncement,
    editAnnouncement: actions.editAnnouncement,
    reorderAnnouncement: actions.reorderAnnouncement,
    deleteAnnouncement: actions.deleteAnnouncement,
    saveChanges: actions.saveAnnouncement,
    clearForm: () => dispatch(change('announcements', 'content', '')),
    fillModal: (content: string) => dispatch(change('announcements', 'content', content)),
    showEditModal: actions.showEditModal
  }, dispatch);
};

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps)
);

export default enhance(Announcements);
