import mongoose, { Schema, Document } from 'mongoose';

export interface IPrediction extends Document {
  datasetId: mongoose.Types.ObjectId;
  columnName: string;
  forecastData?: any[];
  anomalyData?: any[];
  insights?: string[];
  confidence: number;
  accuracy: number;
  createdAt: Date;
  expiresAt: Date;
}

const predictionSchema = new Schema<IPrediction>(
  {
    datasetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dataset',
      required: true,
      index: true,
    },
    columnName: {
      type: String,
      required: true,
    },
    forecastData: [mongoose.Schema.Types.Mixed],
    anomalyData: [mongoose.Schema.Types.Mixed],
    insights: [String],
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      default: 80,
    },
    accuracy: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  },
  { timestamps: true }
);

// TTL Index - automatically delete predictions after 7 days
predictionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IPrediction>('Prediction', predictionSchema);
