import * as NS from '../../namespace';

export function setUploadProgress(progress: number): NS.ISetUploadProgress {
  return { type: 'PROFILE:SET_UPLOAD_PROGRESS', payload: progress };
}
