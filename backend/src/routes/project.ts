import express, { Request, Response } from 'express';
import axios from 'axios';
import fs from 'fs';
import { upload, deleteFiles } from '../utils/upload';
import Project from '../models/Project';

const router = express.Router();

const imgBBKey = process.env.IMBGBB_API_KEY; 

// Helper function to upload image to imgBB
const uploadImageToImgBB = async (file: Express.Multer.File): Promise<string> => {

try {
  // Read the file as a base64 string
  const fileData = fs.readFileSync(file.path, { encoding: 'base64' });

  // Create form data with base64-encoded image
  const formData = new FormData();
  formData.append('image', fileData);



  // Send the request to ImgBB
  const response = await axios.post(`https://api.imgbb.com/1/upload?key=${process.env.IMBGBB_API_KEY}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  
  // Return the URL of the uploaded image
  return response.data.data.url;
} catch (error) {
  if (axios.isAxiosError(error)) {
    console.error("Upload to ImgBB failed:", error.response?.data || error.message);
  } else {
    console.error("Unexpected error:", error);
  }
  throw new Error("Upload to ImgBB failed");
}
};

// Route to handle adding a project with file uploads
router.post('/add', (req: Request, res: Response) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const uploadedFiles: Express.Multer.File[] = [];

    try {
      if (!req.files || Array.isArray(req.files)) {
        throw new Error('Invalid files input');
      }
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };

      let thumbnailImgUrl = '';
      const screenshotUrls: string[] = [];
      if (files.thumbnailImg && files.thumbnailImg.length > 0) {
        thumbnailImgUrl = await uploadImageToImgBB(files.thumbnailImg[0]);
        uploadedFiles.push(files.thumbnailImg[0]);
      }

      if (files.screenshots && files.screenshots.length > 0) {
        for (const file of files.screenshots) {
          const url = await uploadImageToImgBB(file);
          screenshotUrls.push(url);
          uploadedFiles.push(file);
        }
      }
      const { title, description, technologies, demoLink, sourceLink } = req.body;

      const project = new Project({
        title,
        description,
        technologies: technologies.split(','), // technologies are sent as a comma-separated string
        demoLink,
        sourceLink,
        thumbnailImg: thumbnailImgUrl,
        screenshots: screenshotUrls,
      });

      await project.save();

      deleteFiles(uploadedFiles, (deleteErr) => {
        if (deleteErr) {
          console.error('Error deleting files:', deleteErr);
        }
      });
      res.status(201).json(project);
    } catch (uploadError) {
      if (uploadError instanceof Error) {
        deleteFiles(uploadedFiles, (deleteErr) => {
          if (deleteErr) {
            console.log('Error deleting files:', deleteErr);
          }
        });

        res.status(500).json({ error: uploadError.message });
      } else {
        res.status(500).json({ error: 'Unknown error occurred' });
      }
    }
  });
});

// Route to handle updating a project with file uploads
router.put('/update/:id', (req: Request, res: Response) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const uploadedFiles: Express.Multer.File[] = [];

    try {
      if (!req.files || Array.isArray(req.files)) {
        throw new Error('Invalid files input');
      }

      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };

      let thumbnailImgUrl = '';
      const screenshotUrls: string[] = [];

      if (files.thumbnailImg && files.thumbnailImg.length > 0) {
        thumbnailImgUrl = await uploadImageToImgBB(files.thumbnailImg[0]);
        uploadedFiles.push(files.thumbnailImg[0]);
      }

      if (files.screenshots && files.screenshots.length > 0) {
        for (const file of files.screenshots) {
          const url = await uploadImageToImgBB(file);
          screenshotUrls.push(url);
          uploadedFiles.push(file);
        }
      }

      const { title, description, technologies, demoLink, sourceLink } = req.body;

      const project = await Project.findById(req.params.id);
      if (!project) {
        throw new Error('Project not found');
      }

      project.title = title || project.title;
      project.description = description || project.description;
      project.technologies = technologies ? technologies.split(',') : project.technologies;
      project.demoLink = demoLink || project.demoLink;
      project.sourceLink = sourceLink || project.sourceLink;
      project.thumbnailImg = thumbnailImgUrl || project.thumbnailImg;
      project.screenshots = screenshotUrls.length > 0 ? screenshotUrls : project.screenshots;

      await project.save();

      deleteFiles(uploadedFiles, (deleteErr) => {
        if (deleteErr) {
          console.error('Error deleting files:', deleteErr);
        }
      });

      res.status(200).json(project);
    } catch (uploadError) {
      if (uploadError instanceof Error) {
        deleteFiles(uploadedFiles, (deleteErr) => {
          if (deleteErr) {
            console.error('Error deleting files:', deleteErr);
          }
        });

        res.status(500).json({ error: uploadError.message });
      } else {
        res.status(500).json({ error: 'Unknown error occurred' });
      }
    }
  });
});

// Route to handle deleting a project
router.delete('/delete/:id', async (req: Request, res: Response) => {
  try {
    // Check if the project exists
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Delete the project
    const result = await Project.deleteOne({ _id: req.params.id });
    
    if (result.deletedCount === 0) {
      return res.status(500).json({ error: 'Failed to delete the project' });
    }

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('Error deleting project:', err);

    // Handle different types of errors
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
});

// Backend Route for Fetching All Projects


// Route to fetch all projects
router.get('/', async (req: Request, res: Response) => {
    try {
        const projects = await Project.find();
       res.json(projects);
       
    } catch (err) {
         // Log error details (consider using a logging library for production)
    console.error('Error fetching projects:', err);

    // Handle different types of errors
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }

});


// Route to fetch a single project by ID
router.get('/:projectId', async (req, res) => {
    const { projectId } = req.params;

    try {
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.json(project);
    } catch (err) {
    console.error('Error fetching projects:', err);

    // Handle different types of errors
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }

});

export default router;
