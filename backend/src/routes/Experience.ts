import express, { Request, Response } from "express";
import Experience, { IExperience } from "../models/Experience";

const router = express.Router();

// Helper function to handle errors
const handleError = (err: unknown, res: Response) => {
  if (err instanceof Error) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  } else {
    console.error("An unknown error occurred");
    res.status(500).json({ error: "An unknown error occurred" });
  }
};

// Route to add a new experience
router.post("/add", async (req: Request, res: Response) => {
  try {
    const { company, role, workTimeline, description } = req.body;

    if (!company || !role || !workTimeline) {
      return res
        .status(400)
        .json({ error: "Please provide company, role, and work timeline" });
    }

    const experience = new Experience({
      company,
      role,
      workTimeline,
      description,
    });

    await experience.save();
    res.status(201).json(experience);
  } catch (err) {
    handleError(err, res);
  }
});

// Route to update an existing experience
router.put("/update/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { company, role, workTimeline, description } = req.body;

    const experience = await Experience.findById(id);
    if (!experience) {
      return res.status(404).json({ error: "Experience not found" });
    }

    if (company) experience.company = company;
    if (role) experience.role = role;
    if (workTimeline) experience.workTimeline = workTimeline;
    if (description) experience.description = description;

    await experience.save();
    res.status(200).json(experience);
  } catch (err) {
    handleError(err, res);
  }
});

// Route to delete an experience
router.delete("/delete/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await Experience.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ error: "Experience not found" });
    }

    res.status(200).json({ message: "Experience deleted successfully" });
  } catch (err) {
    handleError(err, res);
  }
});

// Route to fetch all experiences
router.get("/", async (req: Request, res: Response) => {
  try {
    const experiences = await Experience.find();
    res.status(200).json(experiences);
  } catch (err) {
    handleError(err, res);
  }
});

export default router;
