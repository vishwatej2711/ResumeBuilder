import Resume from '../models/resumeModel.js';
import fs from 'fs'
import path from 'path';


export const createResume = async (req, res) => {
  try {
    const { title } = req.body;

    // Default template structure
    const defaultResumeData = {
      profileInfo: {
        profilePreviewUrl: '',
        fullName: '',
        designation: '',
        summary: '',
      },
      contactInfo: {
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        github: '',
        website: '',
      },
      workExperience: [
        {
          company: '',
          role: '',
          startDate: '',
          endDate: '',
          description: '',
        },
      ],
      education: [
        {
          degree: '',
          institution: '',
          startDate: '',
          endDate: '',
        },
      ],
      skills: [
        {
          name: '',
          progress: '0',
        },
      ],
      projects: [
        {
          title: '',
          description: '',
          github: '',
          liveDemo: '',
        },
      ],
      certifications: [
        {
          title: '',
          issuer: '',
          year: '',
        },
      ],
      languages: [
        {
          name: '',
          progress: 0,
        },
      ],
      interests: [''],
    };

    const newResume = await Resume.create({
      userId: req.user._id,
      title,
      ...defaultResumeData,
      ...req.body, // this allows overriding default fields with form data
    });

    res.status(201).json(newResume);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create resume', error: error.message });
  }
}

//get function
export const getUserResume = async(req,res)=>{
    try {
        const resume = await Resume.find({userId:req.user._id}).sort({
            updatedAt:-1
        });
        res.json(resume)
    } catch (error) {
        res.status(500).json({ message: 'Failed to get resume', error: error.message });
    }
}

//get resume by id
export const getResumeById=async(req,res)=>{
    try {
        const resume = await Resume.findOne({_id:req.params.id,userId:req.user._id})

        if(!resume){
            return res.status(404).json({message:"resume not found or not authorized"})
        }
        res.json(resume)
    } catch (error) {
        res.status(500).json({message:"Failed to get resume ",error:error.message})
    }
}

//update resumes
export const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found or not authorized" });
    }

    // Merge and update resume
    Object.assign(resume, req.body);
    const savedResume = await resume.save();
    res.json(savedResume);

  } catch (error) {
    res.status(500).json({ message: "Failed to update resume", error: error.message });
  }
};


//delete resume
export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id, // fixed: was `id:`
      userId: req.user._id
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found or not authorized" });
    }

    const uploadFolder = path.join(process.cwd(), 'uploads');

    // Delete thumbnail
    if (resume.thumbnailLink) {
      const oldThumbnail = path.join(uploadFolder, path.basename(resume.thumbnailLink));
      if (fs.existsSync(oldThumbnail)) {
        fs.unlinkSync(oldThumbnail);
      }
    }

    // Delete profile image
    if (resume.profileInfo?.profilePreviewUrl) {
      const oldProfile = path.join(uploadFolder, path.basename(resume.profileInfo.profilePreviewUrl));
      if (fs.existsSync(oldProfile)) {
        fs.unlinkSync(oldProfile);
      }
    }

    // Delete document
    await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    res.json({ message: "Resume deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Failed to delete resume", error: error.message });
  }
};
