interface IDocumentTypes {
  [key: string]: number;
}

export const documentTypes: IDocumentTypes = {
  avatar: 1,
  kycForm: 2,
  proofOfId: 3,
  proofOfResidence: 4,
  selfie: 5,
  other: 6
};

export const documentTypeNames = {
  [documentTypes.kycForm]: 'PROFILE:DOCUMENT-TYPES:KYC',
  [documentTypes.proofOfId]: 'PROFILE:DOCUMENT-TYPES:PROOF-OF-ID',
  [documentTypes.proofOfResidence]: 'PROFILE:DOCUMENT-TYPES:PROOF-OF-RESIDENCE',
  [documentTypes.selfie]: 'PROFILE:DOCUMENT-TYPES:SELFIE',
  [documentTypes.other]: 'PROFILE:DOCUMENT-TYPES:OTHER',
};
