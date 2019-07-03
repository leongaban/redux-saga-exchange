import * as React from 'react';
import * as block from 'bem-cn';
import { bind } from 'decko';
import { Document, Page } from 'react-pdf/dist/entry.noworker';

import { Button } from 'shared/view/elements';

import './DocumentViewer.scss';

interface IProps {
  document: string;
  isPdfFile: boolean;
}

interface IState {
  countPages: number;
  numberPage: number;
  scale: number;
}

const b = block('document-viewer');

class DocumentViewer extends React.Component<IProps, IState> {

  public state: IState = {
    countPages: 0,
    numberPage: 1,
    scale: 1,
  };

  public render() {
    const { isPdfFile } = this.props;
    return (
      <div className={b()}>
        {this.renderScaleControls()}
        <div className={b('content')()}>
          {isPdfFile && this.renderPdfViewer()}
          {!isPdfFile && this.renderImageViewer()}
        </div>
        {this.renderControls()}
      </div>);
  }

  @bind
  private renderImageViewer() {
    const { scale } = this.state;
    return (
      <div className={b('image-container')()} style={{ width: `${scale * 100}%` }}>
        <img className={b('image')()} src={this.props.document} width={`${scale * 100}%`}/>
      </div>
    );
  }

  @bind
  private renderPdfViewer() {
    return (
      <div className={b('document')()}>
        <Document
          file={this.props.document}
          onLoadSuccess={this.onDocumentLoad}
        >
          <Page
            pageNumber={this.state.numberPage}
            renderAnnotations={false}
            scale={this.state.scale}
          />
        </Document>
    </div>
    );
  }

  @bind
  private renderScaleControls() {
    return (
      <div className={b('scale-controls')()}>
        <div className={b('button', { scale: true })()}>
          <Button
            color="black-white"
            onClick={this.handleGrowScaleButtonClick}
          >
            +
          </Button>
        </div>
        <div className={b('button', { scale: true })()}>
          <Button
            color="black-white"
            onClick={this.handleLowScaleButtonClick}
          >
            -
          </Button>
        </div>
      </div>
    );
  }

  @bind
  private handleLowScaleButtonClick() {
    const { scale } = this.state;
    if (scale >= 0.6) { // float numbers bug e.g. 0.5000000001 > 0.5
      this.setState({ scale: scale - 0.1 });
    }
  }

  @bind
  private handleGrowScaleButtonClick() {
    const { scale } = this.state;
    if (scale < 2) {
      this.setState({ scale: scale + 0.1 });
    }
  }

  @bind
  private renderControls() {
    const { numberPage, countPages } = this.state;
    const { isPdfFile } = this.props;
    return (
      <div className={b('controls')()}>
        {isPdfFile &&
          <React.Fragment>
            <div className={b('navigation')()}>
              <div className={b('button')()}>
                <Button
                  color="black-white"
                  disabled={this.isDisabledOnPage(1)}
                  onClick={this.handlePrevPageButtonClick}
                >
                  Prev
                </Button>
              </div>
              <div className={b('button', { next: true })()}>
                <Button
                  color="black-white"
                  disabled={this.isDisabledOnPage(this.state.countPages)}
                  onClick={this.handleNextPageButtonClick}
                >
                  Next
                </Button>
              </div>
            </div>
            <div className={b('info')()}>
              {`Page ${numberPage} of ${countPages}`}
            </div>
          </React.Fragment>
        }
        <div className={b('button', { download: true })()}>
          <Button>
            Download
            <a
              className={b('download-link')()}
              href={this.props.document}
              download
            />
          </Button>
        </div>
      </div>
    );
  }

  @bind
  private onDocumentLoad(pdf: any) {
    this.setState({ countPages: pdf.numPages });
  }

  @bind
  private handleNextPageButtonClick() {
    const { numberPage, countPages } = this.state;
    if (numberPage !== countPages) {
      this.setState({ numberPage: numberPage + 1 });
    }
  }

  @bind
  private handlePrevPageButtonClick() {
    const { numberPage } = this.state;
    if (numberPage > 1) {
      this.setState({ numberPage: numberPage - 1 });
    }
  }
  @bind
  private isDisabledOnPage(page: number) {
    return this.state.numberPage === page;
  }
}

export { IProps as IDocumentViewerProps };
export default DocumentViewer;
