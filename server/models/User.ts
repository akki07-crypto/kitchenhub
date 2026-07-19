import mongoose, { Schema, Document } from 'mongoose';

export interface ICookedVersion {
  recipeId: string;
  recipeTitle: string;
  image: string;
  comment: string;
  date: string;
}

export interface IUser extends Document {
  id: string; // custom id like 'user-current'
  name: string;
  email?: string;
  password?: string;
  avatar: string;
  bio: string;
  level: string; // 'Novice Cook' | 'Home Chef' | 'Master Chef'
  savedRecipes: string[]; // recipe IDs
  cookedVersions: ICookedVersion[];
  badges: string[];
  role: 'user' | 'chef' | 'admin';
}

const CookedVersionSchema = new Schema<ICookedVersion>({
  recipeId: { type: String, required: true },
  recipeTitle: { type: String, required: true },
  image: { type: String, required: true },
  comment: { type: String, required: true },
  date: { type: String, required: true }
});

const UserSchema = new Schema<IUser>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String },
  password: { type: String },
  avatar: { type: String, required: true },
  bio: { type: String, required: true },
  level: { type: String, default: 'Home Chef' },
  savedRecipes: [String],
  cookedVersions: [CookedVersionSchema],
  badges: [String],
  role: { type: String, default: 'user' }
});

export default mongoose.model<IUser>('User', UserSchema);
