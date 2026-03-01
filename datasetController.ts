import { Request, Response } from 'express';
import Dataset from '../models/Dataset';
import { ValidationError, NotFoundError } from '../middleware/errorHandler';
import * as XLSX from 'xlsx';
import csv from 'csv-parser';
import { Readable } from 'stream';

export const uploadDataset = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { name } = req.body;
    const file = (req as any).file;

    if (!name || !file) {
      throw new ValidationError('Dataset name and file are required');
    }

    let data: any[] = [];
    let columns: string[] = [];

    // Parse file based on type
    if (file.mimetype === 'text/csv') {
      // Parse CSV
      data = await new Promise((resolve, reject) => {
        const results: any[] = [];
        Readable.from([file.buffer.toString()])
          .pipe(csv())
          .on('data', (row) => results.push(row))
          .on('end', () => resolve(results))
          .on('error', (err) => reject(err));
      });
    } else if (
      file.mimetype ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      // Parse Excel
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      data = XLSX.utils.sheet_to_json(worksheet);
    } else {
      throw new ValidationError('Only CSV and Excel files are supported');
    }

    if (data.length === 0) {
      throw new ValidationError('File is empty');
    }

    columns = Object.keys(data[0]);

    // Create dataset
    const dataset = new Dataset({
      userId,
      name,
      type: 'upload',
      columns,
      data: data.slice(0, 10000), // Store limited data in DB
      fileName: file.originalname,
      rowCount: data.length,
    });

    await dataset.save();

    res.status(201).json({
      success: true,
      message: 'Dataset uploaded successfully',
      dataset: {
        id: dataset._id,
        name: dataset.name,
        rowCount: dataset.rowCount,
        columns: dataset.columns,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const getDatasets = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const datasets = await Dataset.find({ userId }).select('-data');

    res.json({
      success: true,
      datasets,
    });
  } catch (error) {
    throw error;
  }
};

export const getDatasetById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;

    const dataset = await Dataset.findOne({ _id: id, userId });
    if (!dataset) {
      throw new NotFoundError('Dataset not found');
    }

    res.json({
      success: true,
      dataset,
    });
  } catch (error) {
    throw error;
  }
};

export const getDatasetData = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;
    const { limit = 100, skip = 0 } = req.query;

    const dataset = await Dataset.findOne({ _id: id, userId });
    if (!dataset) {
      throw new NotFoundError('Dataset not found');
    }

    const paginatedData = dataset.data?.slice(
      Number(skip),
      Number(skip) + Number(limit)
    );

    res.json({
      success: true,
      data: paginatedData,
      total: dataset.rowCount,
      columns: dataset.columns,
    });
  } catch (error) {
    throw error;
  }
};

export const updateDataset = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;
    const { name } = req.body;

    const dataset = await Dataset.findOneAndUpdate(
      { _id: id, userId },
      { name },
      { new: true }
    );

    if (!dataset) {
      throw new NotFoundError('Dataset not found');
    }

    res.json({
      success: true,
      dataset,
    });
  } catch (error) {
    throw error;
  }
};

export const deleteDataset = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;

    const dataset = await Dataset.findOneAndDelete({ _id: id, userId });
    if (!dataset) {
      throw new NotFoundError('Dataset not found');
    }

    res.json({
      success: true,
      message: 'Dataset deleted successfully',
    });
  } catch (error) {
    throw error;
  }
};
