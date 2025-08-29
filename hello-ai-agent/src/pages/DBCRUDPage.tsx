/**
 * @fileoverview Professional DB CRUD Page with Material-UI and AG Grid
 * @module pages/DBCRUDPage
 */

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Breadcrumbs,
  Link,
} from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { AdminRoute } from '../components/auth/AdminRoute';
import { DataTableComponent } from '../components/DataTableComponent';
import {
  CreateRecordDialog,
  EditRecordDialog,
  DeleteConfirmDialog,
  BulkDeleteConfirmDialog,
} from '../components/CrudFormDialogs';
import {
  useCrudOperations,
  useRealTimeRecords,
} from '../hooks/useCrudOperations';
import {
  GenericRecord,
  CreateRecordInput,
  UpdateRecordInput,
} from '../types/records';

const DBCRUDPage: React.FC = () => {
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  // Selected records for operations
  const [selectedRecord, setSelectedRecord] = useState<GenericRecord | null>(
    null
  );
  const [selectedRecords, setSelectedRecords] = useState<GenericRecord[]>([]);

  // CRUD operations
  const {
    createRecord,
    updateRecord,
    deleteRecord,
    bulkDeleteRecords,
    isCreating,
    isUpdating,
    isDeleting,
    isBulkDeleting,
  } = useCrudOperations();

  // Real-time setup
  const { setupRealtimeSubscription } = useRealTimeRecords();

  // Setup real-time subscription on mount
  React.useEffect(() => {
    const unsubscribe = setupRealtimeSubscription();
    return unsubscribe;
  }, [setupRealtimeSubscription]);

  // Dialog handlers
  const handleCreateRecord = () => {
    setCreateDialogOpen(true);
  };

  const handleEditRecord = (record: GenericRecord) => {
    setSelectedRecord(record);
    setEditDialogOpen(true);
  };

  const handleDeleteRecord = (record: GenericRecord) => {
    setSelectedRecord(record);
    setDeleteDialogOpen(true);
  };

  const handleBulkDelete = (records: GenericRecord[]) => {
    setSelectedRecords(records);
    setBulkDeleteDialogOpen(true);
  };

  // CRUD operation handlers
  const handleCreateSubmit = (data: CreateRecordInput) => {
    createRecord(data, {
      onSuccess: () => {
        setCreateDialogOpen(false);
      },
    });
  };

  const handleUpdateSubmit = (id: string, data: UpdateRecordInput) => {
    updateRecord(
      { id, data },
      {
        onSuccess: () => {
          setEditDialogOpen(false);
          setSelectedRecord(null);
        },
      }
    );
  };

  const handleDeleteConfirm = (id: string) => {
    deleteRecord(id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setSelectedRecord(null);
      },
    });
  };

  const handleBulkDeleteConfirm = (ids: string[]) => {
    bulkDeleteRecords(ids, {
      onSuccess: () => {
        setBulkDeleteDialogOpen(false);
        setSelectedRecords([]);
      },
    });
  };

  // Close handlers
  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedRecord(null);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedRecord(null);
  };

  const handleCloseBulkDeleteDialog = () => {
    setBulkDeleteDialogOpen(false);
    setSelectedRecords([]);
  };

  return (
    <AdminRoute>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#4caf50',
              },
            },
            error: {
              style: {
                background: '#f44336',
              },
            },
          }}
        />

        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
            <Link underline="hover" color="inherit" href="/admin">
              Admin
            </Link>
            <Typography color="text.primary">Database CRUD</Typography>
          </Breadcrumbs>

          <Typography variant="h4" component="h1" gutterBottom>
            Database Records Management
          </Typography>

          <Typography variant="body1" color="text.secondary">
            Manage your database records with advanced filtering, sorting, and
            real-time updates.
          </Typography>
        </Box>

        {/* Main Content */}
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <DataTableComponent
            onCreateRecord={handleCreateRecord}
            onEditRecord={handleEditRecord}
            onDeleteRecord={handleDeleteRecord}
            onBulkDelete={handleBulkDelete}
            height="700px"
          />
        </Paper>

        {/* Create Record Dialog */}
        <CreateRecordDialog
          open={createDialogOpen}
          onClose={handleCloseCreateDialog}
          onSubmit={handleCreateSubmit}
          isLoading={isCreating}
        />

        {/* Edit Record Dialog */}
        <EditRecordDialog
          open={editDialogOpen}
          record={selectedRecord}
          onClose={handleCloseEditDialog}
          onSubmit={handleUpdateSubmit}
          isLoading={isUpdating}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmDialog
          open={deleteDialogOpen}
          record={selectedRecord}
          onClose={handleCloseDeleteDialog}
          onConfirm={handleDeleteConfirm}
          isLoading={isDeleting}
        />

        {/* Bulk Delete Confirmation Dialog */}
        <BulkDeleteConfirmDialog
          open={bulkDeleteDialogOpen}
          records={selectedRecords}
          onClose={handleCloseBulkDeleteDialog}
          onConfirm={handleBulkDeleteConfirm}
          isLoading={isBulkDeleting}
        />
      </Container>
    </AdminRoute>
  );
};

export default DBCRUDPage;
