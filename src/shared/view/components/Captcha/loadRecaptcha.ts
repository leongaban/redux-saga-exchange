const RECAPTCHA_ID = 'recaptcha';

export const loadRecaptcha = (siteKey: string, callback?: () => void) => {
  const existingScript = document.getElementById(RECAPTCHA_ID);

  if (!existingScript) {
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.id = RECAPTCHA_ID;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      callback && callback();
    };
  }

  if (existingScript) {
    showRecaptchaBadge();
    callback && callback();
  }

};

export const hideRecaptchaBadge = () => {
  const badge = document.getElementsByClassName('grecaptcha-badge')[0] as HTMLElement;
  if (badge) {
    badge.style.display = 'none';
  }
};

export const showRecaptchaBadge = () => {
  const badge = document.getElementsByClassName('grecaptcha-badge')[0] as HTMLElement;
  if (badge) {
    badge.style.display = 'block';
  }
};
