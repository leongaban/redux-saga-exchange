export function validatePassword(value: string | undefined): string | undefined {
  if (typeof value !== 'undefined') {
    const errorMessage = (() => {
      const trimmedValue = value.trim();
      let error = '';
      if (trimmedValue.length < 6) {
        error = `Passwords must be at least 6 characters.\n`;
      }
      if (!/[^a-zA-Z0-9]/.test(trimmedValue)) {
        error = `${error}Passwords must have at least one non alphanumeric character.\n`;
      }
      if (!/[a-z]/.test(trimmedValue)) {
        error = `${error}Passwords must have at least one lowercase ('a'-'z').\n`;
      }
      if (!/[A-Z]/.test(trimmedValue)) {
        error = `${error}Passwords must have at least one uppercase('A'-'Z').\n`;
      }
      if (!/[0-9]/.test(trimmedValue)) {
        error = `${error}Passwords must have at least one digit ('0'-'9').\n`;
      }
      return error;
    })();
    return errorMessage.length > 0 ? errorMessage : undefined;
  }
}
