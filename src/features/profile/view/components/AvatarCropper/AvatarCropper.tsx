import React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import Cropper from 'react-cropper';
import 'react-cropper/node_modules/cropperjs/dist/cropper.css';

import { Button } from 'shared/view/elements';
import { IImageFile } from 'shared/types/models';

import { createImageFile } from './helpers';
import './AvatarCropper.scss';

interface IProps {
  image: IImageFile;
  alt: string;
  onConfirmButtonClick(image: IImageFile): void;
  onCancelButtonClick(): void;
}

const b = block('avatar-cropper');

class AvatarCropper extends React.PureComponent<IProps> {
  private cropper: Cropper | null;

  public render() {
    const { image, alt, onCancelButtonClick } = this.props;
    return (
      <div className={b()}>
        <div className={b('cropper')()}>
          <Cropper
            ref={this.initCropper as any}
            style={{ maxHeight: 400, width: '100%' }}
            src={image.preview}
            className={b('image')()}
            viewMode={1}
            aspectRatio={1}
            guides={false}
            alt={alt}
          />
        </div>
        <div className={b('controls')()}>
          <div className={b('button')()}>
            <Button onClick={onCancelButtonClick} color="red">Cancel</Button>
          </div>
          <div className={b('button')()}>
            <Button onClick={this.handleClickButton}>Upload</Button>
          </div>
        </div>
      </div>
    );
  }

  @bind
  private handleClickButton() {
    if (this.cropper) {
      const croppCanvas = this.cropper.getCroppedCanvas();
      croppCanvas.toBlob((blob: Blob) => {
        const { name } = this.props.image;
        const preview = croppCanvas.toDataURL();
        const img = createImageFile(name, preview, [blob], { type: blob.type });
        this.props.onConfirmButtonClick(img);
      });
    }
  }

  @bind
  private initCropper(cropper: Cropper | null) {
    this.cropper = cropper;
  }
}

export default AvatarCropper;
