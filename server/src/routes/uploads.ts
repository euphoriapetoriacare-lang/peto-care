import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { requireAuth } from '../middleware/auth'
import { supabaseAdmin } from '../lib/supabase'

const router = Router()

import { uploadImageCloud, uploadVideoCloud, uploadDocCloud } from '../config/cloudinary'

router.post('/documents', requireAuth(['user', 'vet', 'admin']), uploadDocCloud.single('file'), async (req, res) => {
  try {
    const file = (req as any).file
    const userId = (req as any).user.id

    if (!userId || !file) return res.status(400).json({ error: 'invalid' })

    // Save file metadata to Supabase
    const { data: newFile, error } = await supabaseAdmin
      .from('files')
      .insert({
        user_id: userId,
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path
      })
      .select()
      .single()

    if (error) return res.status(500).json({ error: 'save_failed', message: error.message })

    res.json({ file: newFile, url: file.path })
  } catch (error) {
    console.error('Error uploading document:', error)
    res.status(500).json({ error: 'server_error' })
  }
})

router.post('/images', requireAuth(['user', 'vet', 'petstore', 'admin']), (req, res, next) => {
  uploadImageCloud.single('file')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err)
      if (err.message === 'invalid_image_type') {
        return res.status(400).json({ error: 'invalid_image_type', message: 'Only JPEG, PNG, and WebP images are allowed' })
      }
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'file_too_large', message: 'File size must be less than 10MB' })
      }
      return res.status(400).json({ error: 'upload_failed', message: err.message })
    }
    next()
  })
}, async (req, res) => {
  const file = (req as any).file
  if (!file) {
    return res.status(400).json({
      error: 'no_file',
      message: 'No file received.'
    })
  }

  res.json({ filename: file.filename || file.originalname, path: file.path, url: file.path })
})

router.post('/videos', requireAuth(['vet']), uploadVideoCloud.single('file'), async (req, res) => {
  try {
    const file = (req as any).file
    const userId = (req as any).user.id

    if (!file) return res.status(400).json({ error: 'invalid' })

    // Save file metadata to Supabase
    const { data: newFile, error } = await supabaseAdmin
      .from('files')
      .insert({
        user_id: userId,
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path
      })
      .select()
      .single()

    if (error) return res.status(500).json({ error: 'save_failed', message: error.message })

    res.json({ filename: file.filename || file.originalname, path: file.path, url: file.path, file: newFile })
  } catch (error) {
    console.error('Error uploading video:', error)
    res.status(500).json({ error: 'server_error' })
  }
})

// Get user's uploaded files
router.get('/my-files', requireAuth(['user', 'vet', 'petstore', 'admin']), async (req, res) => {
  try {
    const userId = (req as any).user.id

    const { data: files, error } = await supabaseAdmin
      .from('files')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) return res.status(500).json({ error: 'fetch_failed', message: error.message })
    res.json({ files: files || [] })
  } catch (error) {
    console.error('Error fetching files:', error)
    res.status(500).json({ error: 'failed_to_fetch_files' })
  }
})

export default router

