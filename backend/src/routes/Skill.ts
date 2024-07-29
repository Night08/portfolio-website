import express, { Request, Response } from 'express';
import Skill from '../models/Skill';

const router = express.Router();

// Route to handle adding a new skill
router.post('/add', async (req: Request, res: Response) => {
  const { title, star, icon }: { title: string; star: number; icon: string } = req.body;

  try {
    if (!title || typeof star !== 'number' || star < 1 || star > 5 || !icon) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    const newSkill = new Skill({ title, star, icon });
    await newSkill.save();
    res.status(201).json(newSkill);
  } catch (err) {
    console.error('Error adding skill:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to handle updating a skill
router.put('/update/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, star, icon }: { title?: string; star?: number; icon?: string } = req.body;

  try {
    const skill = await Skill.findById(id);
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    if (title) skill.title = title;
    if (star !== undefined) skill.star = star;
    if (icon) skill.icon = icon;

    await skill.save();
    res.status(200).json(skill);
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error updating skill:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      console.error('Unknown error occurred:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Route to handle deleting a skill
router.delete('/delete/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await Skill.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    res.status(200).json({ message: 'Skill deleted successfully' });
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error deleting skill:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      console.error('Unknown error occurred:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Route to handle fetching all skills
router.get('/', async (req: Request, res: Response) => {
  try {
    const skills = await Skill.find();
    res.status(200).json(skills);
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error fetching skills:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      console.error('Unknown error occurred:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

export default router;
