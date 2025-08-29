/**
 * @fileoverview Professional data table component using AG Grid
 * @module components/DataTableComponent
 */

import React, { useMemo, useCallback, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  ColDef,
  GridReadyEvent,
  SelectionChangedEvent,
  GridApi,
  ModuleRegistry,
  AllCommunityModule,
} from 'ag-grid-community';
import {
  Box,
  Button,
  ButtonGroup,
  Chip,
  IconButton,
  Tooltip,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DeleteSweep as BulkDeleteIcon,
  Refresh as RefreshIcon,
  Download as ExportIcon,
} from '@mui/icons-material';
import { GenericRecord, QueryOptions } from '../types/records';
import { useCrudOperations } from '../hooks/useCrudOperations';
import { format } from 'date-fns';

// AG Grid CSS imports
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

interface DataTableComponentProps {
  onCreateRecord?: () => void;
  onEditRecord?: (record: GenericRecord) => void;
  onDeleteRecord?: (record: GenericRecord) => void;
  onBulkDelete?: (records: GenericRecord[]) => void;
  height?: string;
  queryOptions?: QueryOptions;
}

/**
 * Custom cell renderer for actions column
 */
const ActionsCellRenderer = ({ data, onEdit, onDelete }: any) => {
  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <Tooltip title="Edit Record">
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(data);
          }}
          color="primary"
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete Record">
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(data);
          }}
          color="error"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

/**
 * Custom cell renderer for status with chips
 */
const StatusCellRenderer = ({ value }: any) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      case 'pending':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Chip
      label={value || 'Unknown'}
      size="small"
      color={getStatusColor(value)}
      variant="outlined"
    />
  );
};

/**
 * Custom cell renderer for dates
 */
const DateCellRenderer = ({ value }: any) => {
  if (!value) return <span>-</span>;

  try {
    return (
      <Tooltip title={format(new Date(value), 'PPpp')}>
        <span>{format(new Date(value), 'PPp')}</span>
      </Tooltip>
    );
  } catch (error) {
    return <span>Invalid Date</span>;
  }
};

export const DataTableComponent: React.FC<DataTableComponentProps> = ({
  onCreateRecord,
  onEditRecord,
  onDeleteRecord,
  onBulkDelete,
  height = '600px',
  queryOptions,
}) => {
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [selectedRows, setSelectedRows] = useState<GenericRecord[]>([]);

  const { records, isLoading, isError, error, refetch, isMutating } =
    useCrudOperations(queryOptions);

  // Column definitions
  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        headerName: 'ID',
        field: 'id',
        width: 100,
        pinned: 'left',
        sort: 'desc',
      },
      {
        headerName: 'Name',
        field: 'name',
        flex: 1,
        minWidth: 150,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Description',
        field: 'description',
        flex: 2,
        minWidth: 200,
        filter: 'agTextColumnFilter',
        cellRenderer: ({ value }: any) => (
          <Tooltip title={value || ''}>
            <span
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'block',
              }}
            >
              {value || '-'}
            </span>
          </Tooltip>
        ),
      },
      {
        headerName: 'Status',
        field: 'status',
        width: 120,
        filter: 'agTextColumnFilter',
        cellRenderer: StatusCellRenderer,
      },
      {
        headerName: 'Category',
        field: 'category',
        width: 130,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Created',
        field: 'created_at',
        width: 180,
        filter: 'agTextColumnFilter',
        cellRenderer: DateCellRenderer,
      },
      {
        headerName: 'Updated',
        field: 'updated_at',
        width: 180,
        filter: 'agTextColumnFilter',
        cellRenderer: DateCellRenderer,
      },
      {
        headerName: 'Actions',
        field: 'actions',
        width: 120,
        pinned: 'right',
        sortable: false,
        filter: false,
        resizable: false,
        cellRenderer: ActionsCellRenderer,
        cellRendererParams: {
          onEdit: onEditRecord,
          onDelete: onDeleteRecord,
        },
      },
    ],
    [onEditRecord, onDeleteRecord]
  );

  // Grid ready handler
  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();
  }, []);

  // Selection changed handler
  const onSelectionChanged = useCallback((event: SelectionChangedEvent) => {
    const selected = event.api.getSelectedRows();
    setSelectedRows(selected);
  }, []);

  // Export to CSV
  const handleExport = useCallback(() => {
    if (gridApi) {
      gridApi.exportDataAsCsv({
        fileName: `records-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.csv`,
      });
    }
  }, [gridApi]);

  // Clear filters
  const handleClearFilters = useCallback(() => {
    if (gridApi) {
      gridApi.setFilterModel(null);
    }
  }, [gridApi]);

  // Default column properties
  const defaultColDef = useMemo<ColDef>(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      flex: 0,
    }),
    []
  );

  if (isError) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        <Typography variant="h6">Error Loading Data</Typography>
        <Typography variant="body2">
          {error?.message || 'Failed to load records. Please try again.'}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => refetch()}
          sx={{ mt: 1 }}
          startIcon={<RefreshIcon />}
        >
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      {/* Toolbar */}
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6">Records ({records.length})</Typography>
          {isMutating && <CircularProgress size={20} />}
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {/* Selection actions */}
          {selectedRows.length > 0 && (
            <ButtonGroup size="small">
              <Button
                variant="outlined"
                color="error"
                startIcon={<BulkDeleteIcon />}
                onClick={() => onBulkDelete?.(selectedRows)}
                disabled={isMutating}
              >
                Delete Selected ({selectedRows.length})
              </Button>
            </ButtonGroup>
          )}

          {/* General actions */}
          <ButtonGroup size="small">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onCreateRecord}
              disabled={isMutating}
            >
              Add Record
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => refetch()}
              disabled={isLoading || isMutating}
            >
              Refresh
            </Button>
            <Button
              variant="outlined"
              startIcon={<ExportIcon />}
              onClick={handleExport}
              disabled={records.length === 0}
            >
              Export
            </Button>
          </ButtonGroup>

          <Button size="small" variant="text" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        </Box>
      </Box>

      {/* Data Grid */}
      <Box
        sx={{
          height,
          width: '100%',
          '& .ag-theme-material': {
            fontSize: '14px',
          },
        }}
        className="ag-theme-material"
      >
        <AgGridReact
          rowData={records}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          onSelectionChanged={onSelectionChanged}
          rowSelection={{
            mode: 'multiRow',
            checkboxes: true,
            headerCheckbox: true,
            enableClickSelection: true,
          }}
          enableCellTextSelection={true}
          ensureDomOrder={true}
          loading={isLoading}
          animateRows={true}
          pagination={true}
          paginationPageSize={50}
          paginationPageSizeSelector={[25, 50, 100, 200]}
          suppressPaginationPanel={false}
          // Accessibility
          suppressMenuHide={false}
          // Performance
          suppressChangeDetection={false}
          // Use legacy theme to avoid theming API conflicts
          theme="legacy"
        />
      </Box>
    </Box>
  );
};
