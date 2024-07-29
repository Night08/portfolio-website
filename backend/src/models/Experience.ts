import mongoose, { Document, Schema } from 'mongoose';

// Define an interface for the Experience document
export interface IExperience extends Document {
  company: string;
  role: string;
  workTimeline: string;
  description?: string; // Description is optional
}

// Define the schema for Experience
const ExperienceSchema: Schema<IExperience> = new Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  workTimeline: { type: String, required: true }, // Work timeline as a string
  description: { type: String, default: '' }, // Description is optional
}, { timestamps: true });

// Create and export the Experience model
const Experience = mongoose.model<IExperience>('Experience', ExperienceSchema);

export default Experience;
