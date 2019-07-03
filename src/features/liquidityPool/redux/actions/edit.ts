import * as NS from '../../namespace';

export function setConvertationCurrency(payload: string): NS.ISetConversionCurrency {
  return { type: 'LIQUIDITY-POOL:SET_CONVERSION_CURRENCY', payload };
}

export function setAssetFilter(payload: string): NS.ISetAssetFilter {
  return { type: 'LIQUIDITY-POOL:SET_ASSET_FILTER', payload };
}

export function removeLoanAgreement(): NS.IRemoveLoandAgreement {
  return { type: 'LIQUIDITY-POOL:REMOVE_LOAN_AGREEMENT' };
}
