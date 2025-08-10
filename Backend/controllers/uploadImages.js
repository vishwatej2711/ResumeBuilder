import fs from 'fs';
import path from 'path';
import Resume from '../models/resumeModel.js';

export const uploadResumeImages = async (req, res) => {
  try {
    const resumeId = req.params.id;

    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found or not authorized' });
    }

    const uploadsFolder = path.join(process.cwd(), 'uploads');
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    // Handle thumbnail image
    const newThumbnail = req.files?.thumbnail?.[0];
    if (newThumbnail) {
      if (resume.thumbnailLink) {
        const oldThumbnail = path.join(uploadsFolder, path.basename(resume.thumbnailLink));
        if (fs.existsSync(oldThumbnail)) {
          fs.unlinkSync(oldThumbnail);
        }
      }
      resume.thumbnailLink = `${baseUrl}/uploads/${newThumbnail.filename}`;
    }

    // Handle profile image
    const newProfileImage = req.files?.profileImage?.[0];
    if (newProfileImage) {
      if (resume.profileInfo?.profilePreviewUrl) {
        const oldProfile = path.join(uploadsFolder, path.basename(resume.profileInfo.profilePreviewUrl));
        if (fs.existsSync(oldProfile)) {
          fs.unlinkSync(oldProfile);
        }
      } else {
        resume.profileInfo = resume.profileInfo || {};
      }
      resume.profileInfo.profilePreviewUrl = `${baseUrl}/uploads/${newProfileImage.filename}`;
    }

    await resume.save();

    res.status(200).json({
      message: 'Images uploaded successfully',
      thumbnailLink: resume.thumbnailLink,
      profilePreviewUrl: resume.profileInfo?.profilePreviewUrl || null,
    });
  } catch (err) {
    console.error('Error uploading images:', err);
    res.status(500).json({
      message: 'Failed to upload images',
      error: err.message,
    });
  }
};
