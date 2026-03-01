import mongoose, { Schema, Document } from 'mongoose';

export interface IWidget {
  id: string;
  type: string;
  title: string;
  datasetId?: mongoose.Types.ObjectId;
  config: any;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface IDashboard extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  widgets: IWidget[];
  layout: any;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const widgetSchema = new Schema<IWidget>({
  id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: [
      'bar',
      'line',
      'pie',
      'scatter',
      'table',
      'heatmap',
      'forecast',
      'anomaly',
      'metric',
    ],
  },
  title: {
    type: String,
    required: true,
  },
  datasetId: mongoose.Schema.Types.ObjectId,
  config: mongoose.Schema.Types.Mixed,
  position: {
    x: Number,
    y: Number,
  },
  size: {
    width: Number,
    height: Number,
  },
});

const dashboardSchema = new Schema<IDashboard>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Dashboard name is required'],
      trim: true,
    },
    description: String,
    widgets: [widgetSchema],
    layout: mongoose.Schema.Types.Mixed,
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

dashboardSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IDashboard>('Dashboard', dashboardSchema);
