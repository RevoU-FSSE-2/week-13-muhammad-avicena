import axios, { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";

interface FetchListResult<T> {
  data: T | null;
  loading: boolean;
  error: boolean;
}

const useFetchList = <T>(options: AxiosRequestConfig): FetchListResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  function fetchData() {
    setLoading(true);
    axios(options)
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        console.error(error);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [options.url]);

  return { data, loading, error };
};

export default useFetchList;
