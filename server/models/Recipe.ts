import mongoose, { Schema, Document } from 'mongoose';

export interface IRecipeReview {
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface IRecipeCookedVersion {
  userName: string;
  userAvatar: string;
  image: string;
  comment: string;
  date: string;
}

export interface IRecipe extends Document {
  id: string; // e.g., 'wagyu-ribeye'
  title: string;
  chef: string;
  image: string;
  description: string;
  prepTime: string;
  difficulty: 'Easy' | 'Medium' | 'Expert';
  calories: number;
  videoUrl: string;
  ingredients: string[];
  steps: string[];
  tools: string[]; // names of tools used in this recipe
  reviews: IRecipeReview[];
  cookedVersions: IRecipeCookedVersion[];
}

const RecipeReviewSchema = new Schema<IRecipeReview>({
  reviewerName: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  date: { type: String, required: true }
});

const RecipeCookedVersionSchema = new Schema<IRecipeCookedVersion>({
  userName: { type: String, required: true },
  userAvatar: { type: String, required: true },
  image: { type: String, required: true },
  comment: { type: String, required: true },
  date: { type: String, required: true }
});

const RecipeSchema = new Schema<IRecipe>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  chef: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  prepTime: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Expert'], required: true },
  calories: { type: Number, required: true },
  videoUrl: { type: String, required: true },
  ingredients: [String],
  steps: [String],
  tools: [String],
  reviews: [RecipeReviewSchema],
  cookedVersions: [RecipeCookedVersionSchema]
});

export default mongoose.model<IRecipe>('Recipe', RecipeSchema);
