import { Request, Response } from 'express'
import { AuthRequest } from '@/middleware/auth'
import { ApiResponse } from '../../../shared/src/types'
import { AppError } from '@/middleware/errorHandler'
import fs from 'fs/promises'
import path from 'path'

export async function uploadSingleImage(req: AuthRequest, res: Response<ApiResponse>) {
  try {
    if (!req.file) {
      throw new AppError('이미지 파일이 필요합니다', 400, 'NO_FILE')
    }

    const imageUrl = `/uploads/${req.file.filename}`

    res.status(201).json({
      success: true,
      data: {
        url: imageUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      },
      message: '이미지 업로드가 완료되었습니다'
    })
  } catch (error) {
    // Clean up uploaded file if error occurs
    if (req.file) {
      try {
        await fs.unlink(req.file.path)
      } catch (unlinkError) {
        console.error('파일 삭제 실패:', unlinkError)
      }
    }
    throw error
  }
}

export async function uploadMultipleImages(req: AuthRequest, res: Response<ApiResponse>) {
  try {
    const files = req.files as Express.Multer.File[]
    
    if (!files || files.length === 0) {
      throw new AppError('이미지 파일이 필요합니다', 400, 'NO_FILES')
    }

    const uploadedFiles = files.map(file => ({
      url: `/uploads/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype
    }))

    res.status(201).json({
      success: true,
      data: {
        files: uploadedFiles,
        count: uploadedFiles.length
      },
      message: '이미지 업로드가 완료되었습니다'
    })
  } catch (error) {
    // Clean up uploaded files if error occurs
    const files = req.files as Express.Multer.File[]
    if (files && files.length > 0) {
      for (const file of files) {
        try {
          await fs.unlink(file.path)
        } catch (unlinkError) {
          console.error('파일 삭제 실패:', unlinkError)
        }
      }
    }
    throw error
  }
}

export async function deleteImage(req: AuthRequest, res: Response<ApiResponse>) {
  try {
    const { filename } = req.params
    
    if (!filename) {
      throw new AppError('파일명이 필요합니다', 400, 'NO_FILENAME')
    }

    // Security check: ensure filename doesn't contain path traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      throw new AppError('유효하지 않은 파일명입니다', 400, 'INVALID_FILENAME')
    }

    const filePath = path.join(process.cwd(), 'uploads', filename)

    // Check if file exists
    try {
      await fs.access(filePath)
    } catch {
      throw new AppError('파일을 찾을 수 없습니다', 404, 'FILE_NOT_FOUND')
    }

    // Delete file
    await fs.unlink(filePath)

    res.json({
      success: true,
      message: '파일이 삭제되었습니다'
    })
  } catch (error) {
    throw error
  }
}