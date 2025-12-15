import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { authenticate } from '@/middleware/auth'
import { asyncHandler } from '@/middleware/errorHandler'
import * as uploadController from '@/controllers/uploadController'

const router = Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    cb(null, file.fieldname + '-' + uniqueSuffix + ext)
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5 // Maximum 5 files
  },
  fileFilter: (req, file, cb) => {
    // Allow only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('이미지 파일만 업로드 가능합니다'))
    }
  }
})

// File upload routes
router.post('/image', authenticate, upload.single('image'), asyncHandler(uploadController.uploadSingleImage))
router.post('/images', authenticate, upload.array('images', 5), asyncHandler(uploadController.uploadMultipleImages))

// File management routes
router.delete('/image/:filename', authenticate, asyncHandler(uploadController.deleteImage))

export default router