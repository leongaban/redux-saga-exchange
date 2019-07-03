import MobileDetect from 'mobile-detect';

class MobileDetector {
  private mobileDetect: MobileDetect;

  constructor(userAgent: string) {
    this.mobileDetect = new MobileDetect(userAgent);
  }

  public isClientDeviceMobile(): boolean {
    return !!this.mobileDetect.mobile();
  }
}

export default MobileDetector;
