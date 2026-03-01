import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import datasetService from '../services/datasetService';
import predictService from '../services/predictService';

function Analytics() {
  const [datasets, setDatasets] = useState<any[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<any>(null);
  const [selectedColumn, setSelectedColumn] = useState('');
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState<any>(null);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'forecast' | 'anomalies' | 'insights'>('forecast');

  useEffect(() => {
    loadDatasets();
  }, []);

  const loadDatasets = async () => {
    try {
      const response = await datasetService.getDatasets();
      setDatasets(response.datasets);
    } catch (error) {
      console.error('Failed to load datasets:', error);
    }
  };

  const handleGenerateForecast = async () => {
    if (!selectedDataset || !selectedColumn) return;

    try {
      setLoading(true);
      const response = await predictService.getForecast(
        selectedDataset._id,
        selectedColumn,
        30
      );
      setForecast(response.prediction);
    } catch (error) {
      console.error('Failed to generate forecast:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDetectAnomalies = async () => {
    if (!selectedDataset || !selectedColumn) return;

    try {
      setLoading(true);
      const response = await predictService.getAnomalies(
        selectedDataset._id,
        selectedColumn
      );
      setAnomalies(response.prediction.anomalies || []);
    } catch (error) {
      console.error('Failed to detect anomalies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInsights = async () => {
    if (!selectedDataset || !selectedColumn) return;

    try {
      setLoading(true);
      const response = await predictService.getInsights(
        selectedDataset._id,
        selectedColumn
      );
      setInsights(response.prediction.insights || []);
    } catch (error) {
      console.error('Failed to generate insights:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sample forecast visualization data
  const forecastChartData = forecast?.forecast
    ? forecast.forecast.map((value: number, index: number) => ({
        period: index,
        value,
        lower: forecast.lower_bound?.[index] || 0,
        upper: forecast.upper_bound?.[index] || 0,
      }))
    : [];

  const anomalyChartData = anomalies.slice(0, 10).map((a: any) => ({
    index: a.index,
    value: a.value,
    severity: a.severity,
  }));

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        🤖 AI-Powered Predictive Analytics
      </Typography>

      <Grid container spacing={3}>
        {/* Control Panel */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Analysis Controls
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                Select Dataset:
              </Typography>
              <select
                value={selectedDataset?._id || ''}
                onChange={(e) => {
                  const ds = datasets.find((d) => d._id === e.target.value);
                  setSelectedDataset(ds);
                  setSelectedColumn('');
                }}
                style={{ width: '100%', padding: '8px', marginTop: '4px' }}
              >
                <option value="">Choose dataset...</option>
                {datasets.map((ds) => (
                  <option key={ds._id} value={ds._id}>
                    {ds.name}
                  </option>
                ))}
              </select>
            </Box>

            {selectedDataset && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Select Column:
                </Typography>
                <select
                  value={selectedColumn}
                  onChange={(e) => setSelectedColumn(e.target.value)}
                  style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                >
                  <option value="">Choose column...</option>
                  {selectedDataset.columns.map((col: string) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </Box>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleGenerateForecast}
                disabled={!selectedColumn || loading}
                fullWidth
              >
                📈 Forecast
              </Button>
              <Button
                variant="contained"
                color="warning"
                onClick={handleDetectAnomalies}
                disabled={!selectedColumn || loading}
                fullWidth
              >
                🚨 Anomalies
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleGenerateInsights}
                disabled={!selectedColumn || loading}
                fullWidth
              >
                💡 Insights
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Results Panel */}
        <Grid item xs={12} md={9}>
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
              <CircularProgress />
            </Box>
          )}

          {!loading && activeTab === 'forecast' && forecast && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📊 Forecast Results
                </Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Confidence: {forecast.confidence}%
                </Alert>
                {forecastChartData.length > 0 && (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={forecastChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="value" stroke="#1976d2" name="Forecast" />
                      <Line type="monotone" dataKey="lower" stroke="#ddd" strokeDasharray="5 5" name="Lower Bound" />
                      <Line type="monotone" dataKey="upper" stroke="#ddd" strokeDasharray="5 5" name="Upper Bound" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          )}

          {!loading && activeTab === 'anomalies' && anomalies.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🚨 Anomaly Detection Results
                </Typography>
                {anomalyChartData.length > 0 && (
                  <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="index" />
                      <YAxis />
                      <Tooltip />
                      <Scatter dataKey="value" data={anomalyChartData} fill="#ff6b6b" />
                    </ScatterChart>
                  </ResponsiveContainer>
                )}
                <List sx={{ mt: 2 }}>
                  {anomalies.slice(0, 5).map((a: any, idx: number) => (
                    <ListItem key={idx}>
                      <ListItemText
                        primary={`Index ${a.index}: ${a.value?.toFixed(2)}`}
                        secondary={`Severity: ${a.severity} | Score: ${a.z_score?.toFixed(2)}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}

          {!loading && activeTab === 'insights' && insights.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  💡 Generated Insights
                </Typography>
                <List>
                  {insights.map((insight: string, idx: number) => (
                    <ListItem key={idx}>
                      <ListItemText primary={insight} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}

          {!loading && !forecast && !anomalies.length && !insights.length && (
            <Paper sx={{ p: 3, textAlign: 'center', color: 'textSecondary' }}>
              <Typography>Select a dataset and column, then click an analysis button</Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default Analytics;
