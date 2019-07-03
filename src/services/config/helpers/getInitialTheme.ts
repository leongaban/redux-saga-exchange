import { UITheme } from 'shared/types/ui';

function getInitialTheme(): UITheme {
  switch (localStorage.getItem('uiTheme')) {
    case 'day':
    case 'night':
    case 'moon':
      return localStorage.getItem('uiTheme') as UITheme;
    default:
      return 'day';
  }
}

export default getInitialTheme;
