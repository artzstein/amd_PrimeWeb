import mongoose, { Schema, Document } from 'mongoose';

export interface IDataset extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  type: 'upload' | 'database';
  columns: string[];
  data?: any[];
  fileUrl?: string;
  fileName?: string;
  dbConnection?: {
    host: string;
    port: number;
    database: string;
    table: string;
  };
  rowCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const datasetSchema = new Schema<IDataset>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Dataset name is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['upload', 'database'],
      default: 'upload',
    },
    columns: [
      {
        type: String,
      },
    ],
    data: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    fileUrl: String,
    fileName: String,
    dbConnection: {
      host: String,
      port: Number,
      database: String,
      table: String,
    },
    rowCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Index for faster queries
datasetSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IDataset>('Dataset', datasetSchema);
