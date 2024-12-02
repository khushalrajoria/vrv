import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { permissionsApi } from '../../services/permissionsApi';

const categories = ['User Management', 'Role Management', 'System', 'Reports', 'Configuration'];

export default function PermissionsPage() {
  const theme = useTheme();
  const [permissions, setPermissions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    isActive: true,
  });

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    try {
      const data = await permissionsApi.getAllPermissions();
      setPermissions(data);
    } catch (error) {
      console.error('Failed to load permissions:', error);
    }
  };

  const handleOpenDialog = (permission = null) => {
    if (permission) {
      setSelectedPermission(permission);
      setFormData(permission);
    } else {
      setSelectedPermission(null);
      setFormData({
        name: '',
        description: '',
        category: '',
        isActive: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPermission(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedPermission) {
        await permissionsApi.updatePermission(selectedPermission.id, formData);
      } else {
        await permissionsApi.createPermission(formData);
      }
      handleCloseDialog();
      loadPermissions();
    } catch (error) {
      console.error('Failed to save permission:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this permission?')) {
      try {
        await permissionsApi.deletePermission(id);
        loadPermissions();
      } catch (error) {
        console.error('Failed to delete permission:', error);
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Permissions Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Permission
        </Button>
      </Box>

      <Grid container spacing={3}>
        {permissions.map((permission) => (
          <Grid item xs={12} sm={6} md={4} key={permission.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                '&:hover': {
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {permission.name}
                  </Typography>
                  <Chip
                    label={permission.isActive ? 'Active' : 'Inactive'}
                    color={permission.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
                <Typography color="textSecondary" gutterBottom>
                  {permission.category}
                </Typography>
                <Typography variant="body2">
                  {permission.description}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton
                  size="small"
                  onClick={() => handleOpenDialog(permission)}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDelete(permission.id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {selectedPermission ? 'Edit Permission' : 'Add Permission'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <TextField
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                fullWidth
              />
              <TextField
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                fullWidth
                multiline
                rows={2}
              />
              <TextField
                select
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                fullWidth
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} startIcon={<CloseIcon />}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" startIcon={<CheckIcon />}>
              {selectedPermission ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
} 