import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

const data = [
    { id: 1, name: 'Item 1', price: '$10.00' },
    { id: 2, name: 'Item 2', price: '$15.00' },
    { id: 3, name: 'Item 3', price: '$20.00' },
];

const ActionTable = () => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell>{row.id}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.price}</TableCell>
                            <TableCell>
                                {/* Action buttons */}
                                <Button variant="contained" color="primary" size="small" >
                                    Edit
                                </Button>
                                <Button variant="contained" color="secondary" size="small">
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ActionTable;
