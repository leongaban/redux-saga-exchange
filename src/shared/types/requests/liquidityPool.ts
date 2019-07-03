export interface IMakePayoutRequest {
  assetId: string;
  amount: number;
  paymentSystem: 'LiquidityPool';
}

export interface IPandaDocsRequest {
  firstName: string;
  lastName: string;
  email: string;
  amount: number;
  address: string;
}

export interface IPandaDocsResponse {
  pandaDocUrl: string;
  pandaDocId: string;
}
