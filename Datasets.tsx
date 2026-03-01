import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  TextField,
  Input,
  CircularProgress,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import datasetService from '../services/datasetService';

interface Dataset {
  _id: string;
  name: string;
  type: string;
  rowCount: number;
  columns: string[];
  createdAt: string;
}

function Datasets() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [datasetName, setDatasetName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDatasets();
  }, []);

  const loadDatasets = async () => {
    try {
      setLoading(true);
      const response = await datasetService.getDatasets();
      setDatasets(response.datasets);
    } catch (err) {
      console.error('Failed to load datasets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    setError('');
    if (!selectedFile || !datasetName) {
      setError('Please select a file and provide a name');
      return;
    }

    try {
      setUploading(true);
      await datasetService.uploadDataset(selectedFile, datasetName);
      await loadDatasets();
      setOpenDialog(false);
      setSelectedFile(null);
      setDatasetName('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDataset = async (id: string) => {
    try {
      await datasetService.deleteDataset(id);
      setDatasets(datasets.filter((d) => d._id !== id));
    } catch (err) {
      console.error('Failed to delete dataset:', err);
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
        <Typography variant="h4">Datasets</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<CloudUploadIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Upload Dataset
        </Button>
      </Box>

      {datasets.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="textSecondary">No datasets yet. Upload your first one!</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>Name</TableCell>
                <TableCell align="right">Rows</TableCell>
                <TableCell align="right">Columns</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {datasets.map((dataset) => (
                <TableRow key={dataset._id}>
                  <TableCell>{dataset.name}</TableCell>
                  <TableCell align="right">{dataset.rowCount}</TableCell>
                  <TableCell align="right">{dataset.columns.length}</TableCell>
                  <TableCell>{new Date(dataset.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteDataset(dataset._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Upload Dataset
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <TextField
            fullWidth
            label="Dataset Name"
            value={datasetName}
            onChange={(e) => setDatasetName(e.target.value)}
            margin="normal"
            disabled={uploading}
          />

          <Box sx={{ mt: 2, mb: 2 }}>
            <Input
              type="file"
              inputProps={{ accept: '.csv,.xlsx,.xls' }}
              onChange={(e: any) => setSelectedFile(e.target.files?.[0])}
              disabled={uploading}
            />
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Supported formats: CSV, Excel (.xlsx, .xls)
            </Typography>
            {selectedFile && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected: {selectedFile.name}
              </Typography>
            )}
          </Box>

          <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={uploading || !selectedFile}
            >
              {uploading ? <CircularProgress size={24} /> : 'Upload'}
            </Button>
            <Button variant="outlined" onClick={() => setOpenDialog(false)} disabled={uploading}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Container>
  );
}

export default Datasets;
