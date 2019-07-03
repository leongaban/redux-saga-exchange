import * as React from 'react';
import block from 'bem-cn';
import Dropzone from 'react-dropzone';
import { ITranslateProps, i18nConnect } from 'services/i18n';

import './AvatarUploadDropzone.scss';
import { bind } from 'decko';
import { Icon } from 'shared/view/elements';
import { IImageFile } from 'shared/types/models';

interface IProps {
  onAvatarImageDrop(file: IImageFile, rejectedFiles?: IImageFile[]): void;
}

interface IState {
  isDropzoneActive: boolean;
}

const b = block('avatar-upload-dropzone');

class AvatarUploadDropzone extends React.PureComponent<IProps & ITranslateProps, IState> {
  public state: IState = {
    isDropzoneActive: false,
  };

  public render() {
    const { isDropzoneActive } = this.state;
    const { children } = this.props;
    return (
      <div className={b()}>
        <Dropzone
          disableClick
          accept="image/*"
          className={b('dropzone')()}
          onDrop={this.handleDrop}
          onDragEnter={this.handleDragEnter}
          onDragLeave={this.handleDragLeave}
        >
          {isDropzoneActive && this.renderOverlay()}
          <div>
            {children}
          </div>
        </Dropzone>
      </div>
    );
  }

  @bind
  private handleDragEnter() {
    this.setState(() => ({ isDropzoneActive: true }));
  }

  @bind
  private handleDragLeave() {
    this.setState(() => ({ isDropzoneActive: false }));
  }

  @bind
  private handleDrop(files: IImageFile[], rejectedFiles?: IImageFile[]) {
    this.setState(() => ({ isDropzoneActive: false }));
    this.props.onAvatarImageDrop(files[0], rejectedFiles);
  }

  @bind
  private renderOverlay() {
    const { translate: t } = this.props;
    return (
      <div className={b('overlay')()}>
        <div className={b('overlay-content')()}>
          <Icon className={b('icon')()} src={require('./images/white-camera-inline.svg')}/>
          <span>{t('PROFILE:AVATAR-UPLOAD-DROPZONE:DROP-IMAGE-TITLE')}</span>
        </div>
      </div>
    );
  }
}

export default i18nConnect(AvatarUploadDropzone);
