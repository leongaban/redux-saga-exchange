import moment from 'moment';

moment.updateLocale('en', {
  longDateFormat: {
    LT : 'hh:mm A',
    LTS : 'HH:mm:ss A',
    L : 'MM/DD/YYYY',
    LL : 'MMMM D YYYY',
    ll : 'D MMM YYYY',
    LLL : 'MMMM D YYYY HH:mm',
    LLLL : 'dddd, MMMM D YYYY HH:mm',
  },
});

moment.updateLocale('ru', {
  longDateFormat: {
    LT : 'H:mm',
    LTS : 'H:mm:ss',
    L : 'DD.MM.YYYY',
    LL : 'D MMMM YYYY',
    LLL : 'D MMMM YYYY, H:mm',
    LLLL : 'dddd, D MMMM YYYY, H:mm',
  },
});

export default moment;
