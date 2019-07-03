import { TwoFAType, ICountry } from 'shared/types/models';

export interface IServerUser {
  nickname: string;
  email: string;
  twoFAType: TwoFAType;
  basicVerification: {
    inReview: boolean;
    completed: boolean;
    firstName: string;
    middleName: string;
    lastName: string;
    country: ICountry;
    documents: string[];
    avatar: string;
    role: string;
    isVerified: boolean;
    dateCreated: string;
    id: string;
    isActive: boolean;
  };
}

export interface IServerOrderInfo {
  orderId: number;
  type: string;
  amount: number;
  price: number;
  isLimit: boolean;
  loanRate: number;
  rateStop: number;
  instrument: string;
  createdAt: string;
  unitsFilled: number;
  isPending: boolean;
  dateArchived?: string;
}
