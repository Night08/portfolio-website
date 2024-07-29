import mongoose, { Document, Schema } from "mongoose";

interface ISkill extends Document {
  icon: string; // Icon name or identifier
  title: string;
  star: number; // Proficiency level (e.g., 1 to 5)
}

const SkillSchema: Schema<ISkill> = new Schema({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  star: { type: Number, required: true, min: 1, max: 5 },
}, { timestamps: true });

const Skill = mongoose.model<ISkill>("Skill", SkillSchema);

export default Skill;
