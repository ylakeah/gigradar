import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

export function uploadFile(req: Request, res: Response, next: NextFunction) {
  upload.single('file')(req, res, next);
}
