import { Request, Response } from 'express';
import Dashboard from '../models/Dashboard';
import { ValidationError, NotFoundError } from '../middleware/errorHandler';

export const createDashboard = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { name, description } = req.body;

    if (!name) {
      throw new ValidationError('Dashboard name is required');
    }

    const dashboard = new Dashboard({
      userId,
      name,
      description,
      widgets: [],
      layout: {},
    });

    await dashboard.save();

    res.status(201).json({
      success: true,
      message: 'Dashboard created successfully',
      dashboard,
    });
  } catch (error) {
    throw error;
  }
};

export const getDashboards = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const dashboards = await Dashboard.find({ userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      dashboards,
    });
  } catch (error) {
    throw error;
  }
};

export const getDashboardById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;

    const dashboard = await Dashboard.findOne({ _id: id, userId }).populate(
      'widgets.datasetId',
      'name columns'
    );

    if (!dashboard) {
      throw new NotFoundError('Dashboard not found');
    }

    res.json({
      success: true,
      dashboard,
    });
  } catch (error) {
    throw error;
  }
};

export const updateDashboard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;
    const { name, description, widgets, layout } = req.body;

    const dashboard = await Dashboard.findOneAndUpdate(
      { _id: id, userId },
      { name, description, widgets, layout },
      { new: true }
    );

    if (!dashboard) {
      throw new NotFoundError('Dashboard not found');
    }

    res.json({
      success: true,
      message: 'Dashboard updated successfully',
      dashboard,
    });
  } catch (error) {
    throw error;
  }
};

export const deleteDashboard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;

    const dashboard = await Dashboard.findOneAndDelete({ _id: id, userId });

    if (!dashboard) {
      throw new NotFoundError('Dashboard not found');
    }

    res.json({
      success: true,
      message: 'Dashboard deleted successfully',
    });
  } catch (error) {
    throw error;
  }
};

export const addWidget = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;
    const { widget } = req.body;

    if (!widget) {
      throw new ValidationError('Widget data is required');
    }

    const dashboard = await Dashboard.findOneAndUpdate(
      { _id: id, userId },
      { $push: { widgets: widget } },
      { new: true }
    );

    if (!dashboard) {
      throw new NotFoundError('Dashboard not found');
    }

    res.json({
      success: true,
      message: 'Widget added successfully',
      dashboard,
    });
  } catch (error) {
    throw error;
  }
};

export const removeWidget = async (req: Request, res: Response) => {
  try {
    const { id, widgetId } = req.params;
    const userId = (req as any).userId;

    const dashboard = await Dashboard.findOneAndUpdate(
      { _id: id, userId },
      { $pull: { 'widgets': { id: widgetId } } },
      { new: true }
    );

    if (!dashboard) {
      throw new NotFoundError('Dashboard not found');
    }

    res.json({
      success: true,
      message: 'Widget removed successfully',
      dashboard,
    });
  } catch (error) {
    throw error;
  }
};
