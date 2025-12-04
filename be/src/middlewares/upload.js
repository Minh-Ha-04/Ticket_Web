import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Real-Madrid', // folder trên Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp','svg'],
  },
});

const upload = multer({ storage });

export default upload;
