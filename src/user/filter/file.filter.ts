import { Request } from 'express';

interface CustomRequest extends Request {
  fileValidationError?: string;
}

export const imageFileFilter = (
  req: CustomRequest,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file.mimetype.match(/^image\/(jpeg|png)$/)) {
    req.fileValidationError = 'Only JPG and PNG files are allowed!';
    return callback(null, false); // Reject file but don't throw an error
  }
  callback(null, true);
};
