import { UITheme } from 'shared/types/ui';
import * as NS from '../../namespace';

export function setTheme(payload: UITheme): NS.ISetTheme {
  return { type: 'CONFIG:SET_THEME', payload };
}
