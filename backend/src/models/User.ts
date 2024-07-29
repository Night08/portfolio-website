import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string; // owner | viewer | collaborator
  canCollaborate: boolean;
  requestedToCollaborate?: boolean;
}

const UserSchema: Schema<IUser> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minLength: 3 },
  role: { type: String, default: "viewer" },
  canCollaborate: { type: Boolean, default: false },
  requestedToCollaborate: { type: Boolean, default: false }
}, { timestamps: true });

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
