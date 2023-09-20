import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useFetchList } from '../../hooks';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface Category {
    id: number;
    name: string;
    is_active: boolean;
}

const DashboardPage: React.FC = () => {
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editedRow, setEditedRow] = useState<Category | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [rowToDelete, setRowToDelete] = useState<Category | null>(null);

    const validate = sessionStorage.getItem('userToken');

    // Function to open the edit modal
    const handleEditData = (row: Category) => {
        setEditedRow(row);
        console.log(row, "isi row edit");
        setEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setEditedRow(null);
        setEditModalOpen(false);
    };

    const handleDeleteData = (row: Category) => {
        setRowToDelete(row);
        setDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setRowToDelete(null);
        setDeleteDialogOpen(false);
    };

    const { data, loading, error } = useFetchList<Category[]>({
        url: 'https://mock-api.arikmpt.com/api/category',
        method: 'GET',
        headers: {
            Authorization: `Bearer ${validate}`,
        },
    });

    const handleDeleteCategory = () => {
        axios.delete(`https://mock-api.arikmpt.com/api/category/${rowToDelete?.id}`,
            { headers: { Authorization: `Bearer ${validate}` } })
            .then((response) => {
                handleCloseDeleteDialog();
                console.log('Delete successful', response.data);
                Swal.fire({
                    icon: 'success',
                    title: 'Delete Successful',
                    text: 'You have successfully deleted the category.',
                })
            }).catch((error) => {
                console.log(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Delete Failed',
                    text: 'An error occurred during delete. Please try again.',
                });
            });
    }

    const handleUpdateCategory = () => {

        console.log(editedRow, "isi edited row")

        axios.put(`https://mock-api.arikmpt.com/api/category/update`, {
            id: editedRow?.id,
            name: editedRow?.name,
            is_active: editedRow?.is_active,
        }, { headers: { Authorization: `Bearer ${validate}` } })
            .then((response) => {
                handleCloseEditModal();
                console.log('Update successful', response.data);
                Swal.fire({
                    icon: 'success',
                    title: 'Update Successful',
                    text: 'You have successfully updated the category.',
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/dashboard';
                    }
                    setInterval(() => {
                        window.location.href = '/dashboard';
                    }, 3000);
                });
            }).catch((error) => {
                console.log(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Update Failed',
                    text: 'An error occurred during update. Please try again.',
                });
            });
    }

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 260 },
        { field: 'name', headerName: 'Name', width: 200 },
        {
            field: 'is_status',
            headerName: 'Status',
            width: 130,
            renderCell: (params) => (<div>{params.row.is_active ? 'true' : 'false'}</div>)
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEditData(params.row)
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteData(params.row);
                        }}
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error while fetching data...</div>
    }

    if (!validate) {
        window.location.href = '/';
    }

    return (
        <>
            <Dialog open={editModalOpen} onClose={handleCloseEditModal}>
                <DialogTitle>Edit Row</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        style={{ margin: '10px 0' }}
                        value={editedRow?.name || ''}
                        onChange={(e) => {
                            if (editedRow) {
                                setEditedRow({ ...editedRow, name: e.target.value });
                            }
                        }}
                        fullWidth
                    />
                    <TextField
                        label="Status"
                        select
                        style={{ margin: '25px 0' }}
                        value={editedRow?.is_active ? 'active' : 'inactive'}
                        onChange={(e) => {
                            if (editedRow) {
                                setEditedRow({ ...editedRow, is_active: e.target.value === 'active' });
                            }
                        }}
                        fullWidth
                    >
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditModal}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            handleUpdateCategory();
                        }}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Delete Row</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this row?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            handleDeleteCategory();
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <div style={{ height: 400, width: '100%' }}>
                {data ? (
                    <DataGrid
                        rows={data}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 5 },
                            },
                        }}
                        pageSizeOptions={[5, 10]}
                    />
                ) : (
                    <div>No data available.</div>
                )}
            </div>
        </>
    );
};

export default DashboardPage;
