import block from 'bem-cn';
import React from 'react';
import { Field, reduxForm, InjectedFormProps  } from 'redux-form';
import { bind } from 'decko';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { EditorField } from 'shared/view/redux-form';
import { Modal, Button } from 'shared/view/elements';

import { selectors } from '../../../redux';
import { IAppReduxStateEnrich } from '../../../namespace';
import './AnnouncementsForm.scss';

interface IOwnProps {
  saving: boolean;
  addAnnouncement(): void;
  editAnnouncement(index: number | null): void;
  clearModal(): void;
  saveChanges(): void;
}

interface IStateProps {
  modalIndex: number | null;
}

type IProps = IOwnProps & IStateProps & InjectedFormProps;

const b = block('announcements-form');

class AnnouncementsForm extends React.Component<IProps> {
  public state = {
    isModalOpened: false
  };

  public componentDidUpdate(prevProps: IProps) {
    if (prevProps.modalIndex !== this.props.modalIndex && this.props.modalIndex !== null) {
      this.showEditModal(this.props.modalIndex);
    }
  }

  public render() {
    const { saving } = this.props;

    return (
      <div className={b()}>
        <Modal
          className={b('modal-announcements')()}
          isOpen={this.state.isModalOpened}
          title={'ADD ANNOUNCEMENT'}
          hasCloseCross
          onClose={this.closeModal}
        >
          <div className={b('editor-field')()}>
            <Field
              name="content"
              type="text"
              component={EditorField}
              {...{
                initialValue: '',
                plugins: 'link code',
                toolbar: 'undo redo | bold italic | code',
                height: 250
              }}
            />
          </div>
          <div className={b('modal-buttons')()}>
            <Button color="text-blue" onClick={this.closeModal}>CANCEL</Button>
            <Button color="text-blue" onClick={this.addAnnouncement}>CONFIRM</Button>
          </div>
        </Modal>
        <div className={b('action-buttons')()}>
          <Button color="text-blue" onClick={this.openModal}>ADD NEW ANNOUNCEMENT</Button>
          <Button color="text-blue" disabled={saving} onClick={this.saveChanges} isShowPreloader={saving}>
            SAVE CHANGES
          </Button>
        </div>
      </div>
    );
  }

  @bind
  public showEditModal(index: number | null): void {
    if (index !== null) {
      this.setState({
        isModalOpened: true,
      });
    }
  }

  @bind
  private openModal() {
    this.setState({
      isModalOpened: true,
    });
  }

  @bind
  private closeModal() {
    this.setState({
      isModalOpened: false
    });

    this.props.clearModal();
  }

  @bind
  private addAnnouncement() {
    if (this.props.modalIndex === null) {
      this.props.addAnnouncement();
    } else {
      this.props.editAnnouncement(this.props.modalIndex);
    }
    this.setState({
      isModalOpened: false
    });
  }

  @bind
  private saveChanges() {
    this.props.saveChanges();
  }
}

const mapStateToProps = (state: IAppReduxStateEnrich): IStateProps => {
  return {
    modalIndex: selectors.selectModalIndex(state)
  };
};

const enhance = compose(
  reduxForm<void, IOwnProps>({
    form: 'announcements'
  }),
  connect(mapStateToProps),
);

export default enhance(AnnouncementsForm);
