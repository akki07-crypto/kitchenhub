import mongoose, { Schema, Document } from 'mongoose';

export interface IClass extends Document {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorBio: string;
  instructorAvatar: string;
  duration: string;
  level: string;
  image: string;
  videoUrl: string;
  rating: number;
  studentsCount: number;
}

const ClassSchema = new Schema<IClass>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: String, required: true },
  instructorBio: { type: String, required: true },
  instructorAvatar: { type: String, required: true },
  duration: { type: String, required: true },
  level: { type: String, required: true },
  image: { type: String, required: true },
  videoUrl: { type: String, required: true },
  rating: { type: Number, default: 5.0 },
  studentsCount: { type: Number, default: 0 }
});

export default mongoose.model<IClass>('Class', ClassSchema);
