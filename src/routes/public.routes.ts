import { Router } from 'express';
import { uploadFilesController } from '../controller/uploadFiles.controller.js';

const router = Router();
router.post('/file-upload', uploadFilesController);
export default router;
