import * as NS from '../../namespace';

export function toggleCodeFormVisibility(payload: boolean): NS.IToggleCodeFormVisibility {
  return { type: 'TWO_FA_PROVIDER:TOGGLE_Code_FORM_VISIBILITY', payload };
}
