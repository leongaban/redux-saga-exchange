import { IImageFile } from 'shared/types/models';

export function createImageFile(
  name: string, preview: string, blobParts: Blob[], blobOptions?: BlobPropertyBag,
): IImageFile {
  const img = new Blob(blobParts, blobOptions) as IImageFile;
  img.name = name;
  img.preview = preview;
  return img;
}
