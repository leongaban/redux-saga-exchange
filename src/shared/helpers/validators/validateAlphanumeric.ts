const error = 'Only letters and digits are allowed.';
const regex = /^[a-z0-9]*$/i;

export const validateAlphanumeric = (value: string | undefined) => {
  const valueStr = value ? value : '';
  return regex.test(valueStr) ? undefined : error;
};
