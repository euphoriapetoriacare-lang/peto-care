import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'

cloudinary.config({
  cloud_name: String(process.env.CLOUDINARY_CLOUD_NAME),
  api_key: String(process.env.CLOUDINARY_API_KEY),
  api_secret: String(process.env.CLOUDINARY_API_SECRET)
})

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: () => ({
    folder: 'vet-app/images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'heic'],
    resource_type: 'image'
  } as any)
}) as any

const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: () => ({
    folder: 'vet-app/videos',
    allowed_formats: ['mp4', 'webm', 'mov'],
    resource_type: 'video'
  } as any)
}) as any

const docStorage = new CloudinaryStorage({
  cloudinary,
  params: () => ({
    folder: 'vet-app/documents',
    allowed_formats: ['pdf', 'jpg', 'jpeg', 'png'],
    resource_type: 'auto'
  } as any)
}) as any

export const uploadImageCloud = multer({
  storage: imageStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
})

export const uploadVideoCloud = multer({
  storage: videoStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
})

export const uploadDocCloud = multer({
  storage: docStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
})
