import axios from 'axios';
import { useEffect, useState } from 'react';

interface Category {
    id: number;
    name: string;
    is_active: boolean;
}


const useFetchCategory = () => {
    const [data, setData] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const bearerToken = sessionStorage.getItem('userToken');

    function fetchData() {
        setLoading(true);
        axios
            .get<{ data: Category[] }>('https://mock-api.arikmpt.com/api/category', {
                headers: {
                    'Authorization': `Bearer ${bearerToken}`,
                },
            })
            .then((response) => {
                setData(response.data.data);
            })
            .catch((error) => {
                setError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {
        fetchData();
        //eslint-disable-next-line
    }, [])

    return { data, loading, error }
}

export default useFetchCategory;