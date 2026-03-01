import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  TextField,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import dashboardService from '../services/dashboardService';

interface Dashboard {
  _id: string;
  name: string;
  description?: string;
  widgets: any[];
  createdAt: string;
}

function DashboardPage() {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [newDashboard, setNewDashboard] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    loadDashboards();
  }, []);

  const loadDashboards = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getDashboards();
      setDashboards(response.dashboards);
    } catch (error) {
      console.error('Failed to load dashboards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDashboard = async () => {
    try {
      const response = await dashboardService.createDashboard(
        newDashboard.name,
        newDashboard.description
      );
      setDashboards([...dashboards, response.dashboard]);
      setOpenDialog(false);
      setNewDashboard({ name: '', description: '' });
    } catch (error) {
      console.error('Failed to create dashboard:', error);
    }
  };

  const handleDeleteDashboard = async (id: string) => {
    try {
      await dashboardService.deleteDashboard(id);
      setDashboards(dashboards.filter((d) => d._id !== id));
    } catch (error) {
      console.error('Failed to delete dashboard:', error);
    }
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Dashboards</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          New Dashboard
        </Button>
      </Box>

      {dashboards.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="textSecondary">No dashboards yet. Create your first one!</Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {dashboards.map((dashboard) => (
            <Grid item xs={12} sm={6} md={4} key={dashboard._id}>
              <Card>
                <CardHeader
                  title={dashboard.name}
                  subheader={new Date(dashboard.createdAt).toLocaleDateString()}
                />
                <CardContent>
                  <Typography variant="body2" color="textSecondary">
                    {dashboard.description || 'No description'}
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Widgets: {dashboard.widgets?.length || 0}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton size="small" color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteDashboard(dashboard._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Create New Dashboard
          </Typography>
          <TextField
            fullWidth
            label="Dashboard Name"
            value={newDashboard.name}
            onChange={(e) =>
              setNewDashboard({ ...newDashboard, name: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            value={newDashboard.description}
            onChange={(e) =>
              setNewDashboard({
                ...newDashboard,
                description: e.target.value,
              })
            }
            margin="normal"
            multiline
            rows={3}
          />
          <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateDashboard}
            >
              Create
            </Button>
            <Button
              variant="outlined"
              onClick={() => setOpenDialog(false)}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Container>
  );
}

export default DashboardPage;
