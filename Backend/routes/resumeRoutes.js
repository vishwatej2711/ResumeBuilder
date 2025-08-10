import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createResume,
  deleteResume,
  getResumeById,
  getUserResume,
  updateResume,
} from '../controllers/resumeController.js';
import { uploadResumeImages } from '../controllers/uploadImages.js';
import upload from '../middleware/uploadMiddleware.js';

const resumeRouter = express.Router();

// Create resume
resumeRouter.post('/', protect, createResume);

// Get all resumes for the user
resumeRouter.get('/', protect, getUserResume);

// Get a single resume by ID
resumeRouter.get('/:id', protect, getResumeById);

// Update a resume
resumeRouter.put('/:id', protect, updateResume);

// Delete a resume
resumeRouter.delete('/:id', protect, deleteResume);

// Upload images (handle multiple fields: 'thumbnail' and 'profileImage')
resumeRouter.post(
  '/:id/upload-images',
  protect,
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'profileImage', maxCount: 1 },
  ]),
  uploadResumeImages
);

export default resumeRouter;
