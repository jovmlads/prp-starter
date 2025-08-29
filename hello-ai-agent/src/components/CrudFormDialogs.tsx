/**
 * @fileoverview CRUD form dialogs for creating and editing records
 * @module components/CrudFormDialogs
 */

import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon, Save as SaveIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  GenericRecord,
  CreateRecordInput,
  UpdateRecordInput,
} from '../types/records';

// Form validation schema
const recordSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  status: z.enum(['active', 'inactive', 'archived']).optional(),
  category: z.enum([
    'products',
    'customers',
    'orders',
    'inventory',
    'campaigns',
    'settings',
    'content',
    'analytics',
  ]),
  metadata: z.record(z.string(), z.any()).optional(),
});

type FormData = z.infer<typeof recordSchema>;

interface CreateRecordDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateRecordInput) => void;
  isLoading?: boolean;
}

interface EditRecordDialogProps {
  open: boolean;
  record: GenericRecord | null;
  onClose: () => void;
  onSubmit: (id: string, data: UpdateRecordInput) => void;
  isLoading?: boolean;
}

interface DeleteConfirmDialogProps {
  open: boolean;
  record: GenericRecord | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
  isLoading?: boolean;
}

interface BulkDeleteConfirmDialogProps {
  open: boolean;
  records: GenericRecord[];
  onClose: () => void;
  onConfirm: (ids: string[]) => void;
  isLoading?: boolean;
}

// Common status options
const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'archived', label: 'Archived' },
];

// Common category options
const categoryOptions = [
  { value: 'products', label: 'Products' },
  { value: 'customers', label: 'Customers' },
  { value: 'orders', label: 'Orders' },
  { value: 'inventory', label: 'Inventory' },
  { value: 'campaigns', label: 'Campaigns' },
  { value: 'settings', label: 'Settings' },
  { value: 'content', label: 'Content' },
  { value: 'analytics', label: 'Analytics' },
];

/**
 * Create Record Dialog Component
 */
export const CreateRecordDialog: React.FC<CreateRecordDialogProps> = ({
  open,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(recordSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'active',
      category: 'products',
    },
  });

  const handleFormSubmit = (data: FormData) => {
    onSubmit({
      ...data,
      metadata: {},
    });
  };

  const handleClose = () => {
    if (!isDirty || confirm('Discard changes?')) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      disableEscapeKeyDown={isLoading}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        Create New Record
        <IconButton onClick={handleClose} disabled={isLoading} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Name Field */}
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Name"
                  required
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={isLoading}
                />
              )}
            />

            {/* Description Field */}
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  multiline
                  rows={3}
                  fullWidth
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  disabled={isLoading}
                />
              )}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              {/* Status Field */}
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    error={!!errors.status}
                    disabled={isLoading}
                  >
                    <InputLabel>Status</InputLabel>
                    <Select {...field} label="Status">
                      {statusOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />

              {/* Category Field */}
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    error={!!errors.category}
                    disabled={isLoading}
                  >
                    <InputLabel>Category</InputLabel>
                    <Select {...field} label="Category">
                      {categoryOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            startIcon={
              isLoading ? <CircularProgress size={16} /> : <SaveIcon />
            }
          >
            {isLoading ? 'Creating...' : 'Create Record'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

/**
 * Edit Record Dialog Component
 */
export const EditRecordDialog: React.FC<EditRecordDialogProps> = ({
  open,
  record,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(recordSchema),
  });

  // Reset form when record changes
  useEffect(() => {
    if (record && open) {
      reset({
        name: record.name || '',
        description: record.description || '',
        status: record.status || 'active',
        category: record.category || 'products',
      });
    }
  }, [record, open, reset]);

  const handleFormSubmit = (data: FormData) => {
    if (record) {
      onSubmit(record.id, {
        ...data,
        metadata: record.metadata || {},
      });
    }
  };

  const handleClose = () => {
    if (!isDirty || confirm('Discard changes?')) {
      reset();
      onClose();
    }
  };

  if (!record) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      disableEscapeKeyDown={isLoading}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        Edit Record: {record.name}
        <IconButton onClick={handleClose} disabled={isLoading} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Form fields identical to CreateRecordDialog */}
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Name"
                  required
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={isLoading}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  multiline
                  rows={3}
                  fullWidth
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  disabled={isLoading}
                />
              )}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    error={!!errors.status}
                    disabled={isLoading}
                  >
                    <InputLabel>Status</InputLabel>
                    <Select {...field} label="Status">
                      {statusOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />

              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    error={!!errors.category}
                    disabled={isLoading}
                  >
                    <InputLabel>Category</InputLabel>
                    <Select {...field} label="Category">
                      {categoryOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            startIcon={
              isLoading ? <CircularProgress size={16} /> : <SaveIcon />
            }
          >
            {isLoading ? 'Updating...' : 'Update Record'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

/**
 * Delete Confirmation Dialog
 */
export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  open,
  record,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const handleConfirm = () => {
    if (record) {
      onConfirm(record.id);
    }
  };

  if (!record) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Delete Record</DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          This action cannot be undone.
        </Alert>
        <Box>
          Are you sure you want to delete the record{' '}
          <strong>"{record.name}"</strong>?
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={16} /> : undefined}
        >
          {isLoading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

/**
 * Bulk Delete Confirmation Dialog
 */
export const BulkDeleteConfirmDialog: React.FC<
  BulkDeleteConfirmDialogProps
> = ({ open, records, onClose, onConfirm, isLoading = false }) => {
  const handleConfirm = () => {
    const ids = records.map((record) => record.id);
    onConfirm(ids);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Delete Multiple Records</DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          This action cannot be undone.
        </Alert>
        <Box>
          Are you sure you want to delete <strong>{records.length}</strong>{' '}
          record(s)?
        </Box>
        {records.length <= 5 && (
          <Box sx={{ mt: 2 }}>
            <strong>Records to delete:</strong>
            <ul>
              {records.map((record) => (
                <li key={record.id}>{record.name}</li>
              ))}
            </ul>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={16} /> : undefined}
        >
          {isLoading ? 'Deleting...' : `Delete ${records.length} Record(s)`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
