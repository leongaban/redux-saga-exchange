class PanelBlock {
  private widthValue: number = 0;
  private cssHandler: (cssName: string, value: string) => void;
  private textHandler: (value: string) => void;

  constructor(cssHandler: any, textHandler: any) {
    this.cssHandler = cssHandler;
    this.textHandler = textHandler;
  }

  public text(value: string) {
    this.textHandler(value);
    return this;
  }

  public css(name: string, value: string) {
    this.cssHandler(name, value);
    return this;
  }

  public scx() {
    return this;
  }

  public width(value?: number) {
    if (value !== undefined) {
      this.cssHandler('width', value.toString());
      this.widthValue = value;
      return this;
    }
    return this.widthValue;
  }
}

export default PanelBlock;
