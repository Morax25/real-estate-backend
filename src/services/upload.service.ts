// services/upload.service.ts
import pLimit from 'p-limit';
import { uploadToCloudinary } from '../infra/cloudinary.js';

type UploadResult = {
  url: string;
  public_id: string;
};

export const uploadFilesService = async (files: Express.Multer.File[]) => {
  const limit = pLimit(5);

  const results = await Promise.allSettled(
    files.map((file) => limit(() => uploadToCloudinary(file.path)))
  );

  const success: UploadResult[] = results
    .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
    .map((r) => ({
      url: r.value.secure_url,
      public_id: r.value.public_id,
    }));

  const failedCount = results.filter((r) => r.status === 'rejected').length;

  return {
    success,
    failedCount,
  };
};
