import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample data for demonstration
const sampleData = [
  { month: 'Jan', sales: 4000, revenue: 2400 },
  { month: 'Feb', sales: 3000, revenue: 1398 },
  { month: 'Mar', sales: 2000, revenue: 9800 },
  { month: 'Apr', sales: 2780, revenue: 3908 },
  { month: 'May', sales: 1890, revenue: 4800 },
  { month: 'Jun', sales: 2390, revenue: 3800 },
];

interface Widget {
  id: string;
  type: string;
  title: string;
}

function DashboardBuilder() {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [widgetTitle, setWidgetTitle] = useState('');
  const [widgetType, setWidgetType] = useState('bar');

  const addWidget = () => {
    if (widgetTitle) {
      const newWidget: Widget = {
        id: Date.now().toString(),
        type: widgetType,
        title: widgetTitle,
      };
      setWidgets([...widgets, newWidget]);
      setWidgetTitle('');
      setWidgetType('bar');
    }
  };

  const removeWidget = (id: string) => {
    setWidgets(widgets.filter((w) => w.id !== id));
  };

  const renderChart = (type: string) => {
    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sampleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#1976d2" />
              <Bar dataKey="revenue" fill="#42a5f5" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sampleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#1976d2" />
              <Line type="monotone" dataKey="revenue" stroke="#42a5f5" />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sampleData}
                dataKey="sales"
                nameKey="month"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {sampleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#1976d2', '#42a5f5', '#64b5f6'][index % 3]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Builder
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Add Widget
            </Typography>
            <TextField
              fullWidth
              label="Widget Title"
              value={widgetTitle}
              onChange={(e) => setWidgetTitle(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              select
              label="Chart Type"
              value={widgetType}
              onChange={(e) => setWidgetType(e.target.value)}
              margin="normal"
              SelectProps={{
                native: true,
              }}
            >
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
              <option value="pie">Pie Chart</option>
            </TextField>
            <Button fullWidth variant="contained" color="primary" onClick={addWidget} sx={{ mt: 2 }}>
              Add Widget
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>
            Dashboard Preview
          </Typography>
          {widgets.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center', color: 'textSecondary' }}>
              No widgets added yet
            </Paper>
          ) : (
            <Grid container spacing={2}>
              {widgets.map((widget) => (
                <Grid item xs={12} md={6} key={widget.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">{widget.title}</Typography>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => removeWidget(widget.id)}
                        >
                          Remove
                        </Button>
                      </Box>
                      {renderChart(widget.type)}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default DashboardBuilder;
