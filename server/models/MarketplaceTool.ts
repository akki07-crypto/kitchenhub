import mongoose, { Schema, Document } from 'mongoose';

export interface IMarketplaceTool extends Document {
  id: string; // matches name or slug e.g. 'plating-tweezers'
  name: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  purchaseUrl: string;
}

const MarketplaceToolSchema = new Schema<IMarketplaceTool>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 5.0 },
  image: { type: String, required: true },
  description: { type: String, required: true },
  purchaseUrl: { type: String, required: true }
});

export default mongoose.model<IMarketplaceTool>('MarketplaceTool', MarketplaceToolSchema);
