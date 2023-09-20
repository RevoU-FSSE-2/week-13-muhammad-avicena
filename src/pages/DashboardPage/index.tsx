import { useFetchList } from '../../hooks';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

interface Category {
    id: number;
    name: string;
    is_active: boolean;
}

const DashboardPage: React.FC = () => {

    const validate = sessionStorage.getItem('userToken');

    const { data, loading, error } = useFetchList<Category[]>({
        url: 'https://mock-api.arikmpt.com/api/category',
        method: 'GET',
        headers: {
            Authorization: `Bearer ${validate}`,
        },
    });

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
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.map((row: Category, index: number) => (
                            <TableRow key={index} >
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell><div>{row.is_active ? 'true' : 'false'}</div></TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary" size="small" >
                                        Edit
                                    </Button>
                                    <Button variant="contained" color="error" size="small" >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer >
        </>
    );
};

export default DashboardPage;
