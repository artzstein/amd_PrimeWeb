import { Request, Response } from 'express';
import axios from 'axios';
import Prediction from '../models/Prediction';
import Dataset from '../models/Dataset';
import { ValidationError, NotFoundError } from '../middleware/errorHandler';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5000';

export const getForecast = async (req: Request, res: Response) => {
  try {
    const { datasetId, columnName, periods = 30 } = req.body;
    const userId = (req as any).userId;

    if (!datasetId || !columnName) {
      throw new ValidationError('datasetId and columnName are required');
    }

    // Verify dataset ownership
    const dataset = await Dataset.findOne({ _id: datasetId, userId });
    if (!dataset) {
      throw new NotFoundError('Dataset not found');
    }

    // Call ML service
    const mlResponse = await axios.post(`${ML_SERVICE_URL}/api/forecast`, {
      data: dataset.data,
      columnName,
      periods,
    });

    if (!mlResponse.data.success) {
      throw new Error('ML service forecast failed');
    }

    // Store prediction
    const prediction = new Prediction({
      datasetId,
      columnName,
      forecastData: mlResponse.data.forecast,
      confidence: mlResponse.data.confidence || 80,
      accuracy: mlResponse.data.accuracy || 0,
    });

    await prediction.save();

    res.json({
      success: true,
      prediction: {
        id: prediction._id,
        forecast: mlResponse.data.forecast,
        confidence: prediction.confidence,
        accuracy: prediction.accuracy,
      },
    });
  } catch (error) {
    if (error instanceof ValidationError || error instanceof NotFoundError) {
      throw error;
    }
    console.error('Forecast error:', error);
    throw new Error('Failed to generate forecast');
  }
};

export const getAnomalies = async (req: Request, res: Response) => {
  try {
    const { datasetId, columnName, sensitivity = 0.95 } = req.body;
    const userId = (req as any).userId;

    if (!datasetId || !columnName) {
      throw new ValidationError('datasetId and columnName are required');
    }

    // Verify dataset ownership
    const dataset = await Dataset.findOne({ _id: datasetId, userId });
    if (!dataset) {
      throw new NotFoundError('Dataset not found');
    }

    // Call ML service
    const mlResponse = await axios.post(`${ML_SERVICE_URL}/api/anomalies`, {
      data: dataset.data,
      columnName,
      sensitivity,
    });

    if (!mlResponse.data.success) {
      throw new Error('ML service anomaly detection failed');
    }

    // Store prediction
    const prediction = new Prediction({
      datasetId,
      columnName,
      anomalyData: mlResponse.data.anomalies,
      confidence: mlResponse.data.confidence || 80,
    });

    await prediction.save();

    res.json({
      success: true,
      prediction: {
        id: prediction._id,
        anomalies: mlResponse.data.anomalies,
        anomalyCount: mlResponse.data.anomalies?.length || 0,
        confidence: prediction.confidence,
      },
    });
  } catch (error) {
    if (error instanceof ValidationError || error instanceof NotFoundError) {
      throw error;
    }
    console.error('Anomaly detection error:', error);
    throw new Error('Failed to detect anomalies');
  }
};

export const getInsights = async (req: Request, res: Response) => {
  try {
    const { datasetId, columnName } = req.body;
    const userId = (req as any).userId;

    if (!datasetId || !columnName) {
      throw new ValidationError('datasetId and columnName are required');
    }

    // Verify dataset ownership
    const dataset = await Dataset.findOne({ _id: datasetId, userId });
    if (!dataset) {
      throw new NotFoundError('Dataset not found');
    }

    // Call ML service
    const mlResponse = await axios.post(`${ML_SERVICE_URL}/api/insights`, {
      data: dataset.data,
      columnName,
    });

    if (!mlResponse.data.success) {
      throw new Error('ML service insights generation failed');
    }

    // Store prediction
    const prediction = new Prediction({
      datasetId,
      columnName,
      insights: mlResponse.data.insights || [],
      confidence: mlResponse.data.confidence || 80,
    });

    await prediction.save();

    res.json({
      success: true,
      prediction: {
        id: prediction._id,
        insights: mlResponse.data.insights,
        confidence: prediction.confidence,
      },
    });
  } catch (error) {
    if (error instanceof ValidationError || error instanceof NotFoundError) {
      throw error;
    }
    console.error('Insights generation error:', error);
    throw new Error('Failed to generate insights');
  }
};

export const getPredictions = async (req: Request, res: Response) => {
  try {
    const { datasetId } = req.query;
    const userId = (req as any).userId;

    const query: any = {};
    if (datasetId) {
      query.datasetId = datasetId;
    }

    const predictions = await Prediction.find(query);

    res.json({
      success: true,
      predictions,
    });
  } catch (error) {
    throw error;
  }
};

export const getPredictionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const prediction = await Prediction.findById(id);
    if (!prediction) {
      throw new NotFoundError('Prediction not found');
    }

    res.json({
      success: true,
      prediction,
    });
  } catch (error) {
    throw error;
  }
};
