import mongoose, { Document, Schema } from "mongoose";

// Define the interface for the Project document
interface IProject extends Document {
  title: string;
  description: string;
  technologies: string[];
  demoLink: string;
  sourceLink: string;
  thumbnailImg: string; // Store URL of the uploaded image
  screenshots?: string[]; // Optional array of strings for screenshot URLs
}

// Define the Project schema
const ProjectSchema: Schema<IProject> = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  technologies: { type: [String], required: true }, // Array of strings
  demoLink: { type: String, required: false },
  sourceLink: { type: String, required: false },
  thumbnailImg: { type: String, required: false }, // String for URL of image
  screenshots: { type: [String], required: false }, // Optional array of strings for screenshot URLs
}, { timestamps: true });

// Create and export the Project model
const Project = mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
