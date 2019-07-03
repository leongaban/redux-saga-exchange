import { ICurrencyBalance, IWithdrawSettings } from '../../types/models/balance';

export const currencies: ICurrencyBalance[] = [
  { code: 'BTC', value: 1.2995 },
  { code: 'ETH', value: 0.5091 },
  { code: 'TIOx', value: 10.2995 },
  { code: 'DASH', value: 10248.21 },
];

// tslint:disable
export const balanceMock = { "pay": 100.0, "eth": 100.0, "cnc": 100.0, "usd": 100.0, "aion": 100.0, "rep": 100.0, "bnt": 100.0, "eos": 100.0, "cfi": 100.0, "ltc": 100.0, "srn": 100.0, "dnt": 100.0, "mln": 100.0, "sngls": 100.0, "mgo": 100.0, "trst": 100.0, "wings": 100.0, "neu": 100.0, "san": 100.0, "snm": 100.0, "ptoy": 100.0, "adx": 100.0, "btc": 100.0, "ldc": 100.0, "gnt": 100.0, "bat": 100.0, "ant": 100.0, "net": 100.0, "myst": 100.0, "trx": 100.0, "omg": 100.0, "pro": 100.0, "bmc": 100.0, "edg": 100.0, "time": 100.0, "ast": 100.0, "ind": 100.0, "mana": 100.0, "dgd": 100.0, "ins": 100.0, "icn": 100.0, "gup": 100.0, "ven": 100.0, "waves": 100.0, "knc": 100.0, "xid": 100.0, "wpr": 100.0, "qrl": 100.0, "zrx": 100.0, "req": 100.0, "stx": 100.0, "tkn": 100.0, "taas": 100.0, "salt": 100.0, "ren": 100.0, "bcc": 100.0, "ae": 100.0, "oax": 100.0, "snt": 100.0, "eng": 100.0, "mco": 100.0, "gno": 100.0, "storj": 100.0, "dash": 100.0, "rlc": 100.0, "tnt": 100.0 };


export const withdrawSettings: IWithdrawSettings = {
  withdrawFeePercentage: 0.01,
  blockchainCommisionPercentage: 0.005,
  minimumComissionAmount: 0.001,
};
