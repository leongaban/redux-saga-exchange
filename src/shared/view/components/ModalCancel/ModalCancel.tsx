import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';

import { Button, Modal, Checkbox } from 'shared/view/elements';

import './ModalCancel.scss';

interface IProps {
  isOpen: boolean;
  title: string;
  modalText: string;
  dontShowModalCheckboxLabel?: string;
  confirmButtonLabel?: string;
  onCancel(): void;
  onConfirm(isDontShowModalCheckboxChecked?: boolean): void;
}

interface IState {
  isDontShowModalCheckboxChecked: boolean;
}

const b = block('modal-cancel');
class ModalCancel extends React.PureComponent<IProps, IState> {
  public state: IState = {
    isDontShowModalCheckboxChecked: false,
  };

  public render() {
    const {
      isOpen, title, modalText, onCancel, dontShowModalCheckboxLabel,
      confirmButtonLabel = 'confirm',
    } = this.props;
    return (
      <Modal
        isOpen={isOpen}
        title={title}
        onClose={onCancel}
        hasCloseCross={true}
      >
        <div className={b()}>
          <div className={b('text')()}>
            {modalText}
          </div>
          {dontShowModalCheckboxLabel && this.renderDontShowModalCheckbox()}
          <div className={b('controls')()}>
            <div className={b('button')()}>
              <Button onClick={onCancel} size="large" color="black-white">
                cancel
              </Button>
            </div>
            <div className={b('button')()}>
              <Button onClick={this.handleConfirmButtonClick} size="large">
                {confirmButtonLabel}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  private renderDontShowModalCheckbox() {
    const { dontShowModalCheckboxLabel } = this.props;
    return (
      <div className={b('cancel-modal-display-checkbox')()}>
        <Checkbox
          label={dontShowModalCheckboxLabel}
          onChange={this.handleDontShowModalCheckboxChange}
          checked={this.state.isDontShowModalCheckboxChecked}
        />
      </div>
    );
  }

  @bind
  private handleDontShowModalCheckboxChange(_: React.FormEvent<HTMLInputElement>) {
    this.setState((prevState: IState) => ({
      isDontShowModalCheckboxChecked: !prevState.isDontShowModalCheckboxChecked,
    }));
  }

  @bind
  private handleConfirmButtonClick() {
    const { onConfirm } = this.props;
    const { isDontShowModalCheckboxChecked } = this.state;
    onConfirm(isDontShowModalCheckboxChecked);
  }
}

export default ModalCancel;
