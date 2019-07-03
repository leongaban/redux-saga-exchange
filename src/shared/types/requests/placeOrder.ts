export interface IPlaceOrderRequest {
  orderSide: 'buy' | 'sell';
  amount: string;
  price: string;
  isLimit: boolean;
  loanRate: number;
  rateStop: number;
  instrument: string;
}
