import { useState, useEffect } from "react";
import axios from "axios";

export const useFetchSource = (url, pageNumber = null, searchQuery = null) => {
    const [data, setData] = useState({});
    const [isRefreshed, setIsRefreshed] = useState(false);
    const [isFetching, setIsFetching] = useState(true); // Track if data is fetching
    const [error, setError] = useState(null); // Track any errors

    useEffect(() => {
        const fetchData = async () => {
            try {
                let fetchUrl = url;
                setIsFetching(true);
                if (searchQuery && pageNumber) {
                    fetchUrl = `${url}?page=${pageNumber}&${searchQuery.name}=${searchQuery.value}`;
                } else if (pageNumber) {
                    fetchUrl = `${url}?page=${pageNumber}`;
                }
                const response = await axios.get(fetchUrl);
                setData(response.data);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err); // Set error state
            } finally {
                setIsFetching(false);
                setIsRefreshed(false); // Reset refresh state
            }
        };

        fetchData();
    }, [pageNumber, JSON.stringify(searchQuery), url, isRefreshed]); // Use JSON.stringify for searchQuery

    const refresh = () => {
        setData({}); // Reset data on refresh
        setIsRefreshed(true);
    };

    return { data, isFetching, error, setData, refresh };
};
