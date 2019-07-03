
export function validatePhone(value: string | undefined): string | undefined {
  const phoneNumberRegular = /^\d+$/;

  if (value && !phoneNumberRegular.test(value)) {
    return 'Phone not correct';
  }

  return undefined;
}
