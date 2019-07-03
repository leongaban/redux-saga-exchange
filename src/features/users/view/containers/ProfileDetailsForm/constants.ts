export function getClaimTitle(claimType: string) {
  switch (claimType) {
    case 'ImageUrl':
      return 'Image URL';
    case 'has_2fa_app':
      return 'Has 2FA App';
    case 'DocumentsUrls':
      return 'Documents URLs';
    default:
      return claimType;
  }
}
