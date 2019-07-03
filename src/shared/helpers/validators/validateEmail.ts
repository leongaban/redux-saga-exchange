
export function validateEmail(value: string | undefined): string | undefined {
  // tslint:disable-next-line:max-line-length
  const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return value && !emailReg.test(value) ? 'Invalid email' : undefined;
}
