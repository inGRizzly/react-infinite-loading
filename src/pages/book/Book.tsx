// Import(s) - Core
import { useEffect } from 'react';

// Import(s) - Hooks
import { useParams } from 'react-router-dom';

// Import(s) - Hook
import { useApi } from "hooks/api/useApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// Import(s) - Component
import { Card } from 'components/commons/Card';

// Import(s) - Utils
import { getFlatDataFromInfiniteQuery } from "utils/nav/getFlatDataFromInfiniteQuery";

// Import(s) - Interfaces / Types
import type { GetBookByIdResponseData } from "hooks/api/useApi";

// Import(s) - CSS
import styles from "pages/book/Book.module.css";

// Interfaces / Types
type PageParams = {
    id: string;
}

// Export - Page
const Book = () => {

    // Hook(s)

    const { id } = useParams<PageParams>();

    const {
        getBookById
    } = useApi({
        baseURL: "https://www.anapioficeandfire.com/api/"
    });

    const queryClient = useQueryClient();

    // API call(s)

    const {
        data = {
            name: ""
        },
        refetch
    } = useQuery<GetBookByIdResponseData, Error>(
        ["book", id],
        (queryFunctionContext) => {

            const queryKeys: any[] = [...queryFunctionContext.queryKey];
            const currentId: string | undefined = queryKeys[1] || undefined;

            if (currentId) {
                
                return getBookById({ id: currentId, signal: queryFunctionContext.signal || undefined });
            }

            return {};
        },
        {
            enabled: false,
            retry: 0,
            cacheTime: 1000 * 60 * 5, // 5 minutes
            staleTime: 0
        }
    );

    // Effect - To listen id

    useEffect(() => {

        // Check if data is in cache
        let bookData = undefined;
        const booksData: any = queryClient.getQueryData(["books"]);
        if (booksData) {
            
            const flatData = getFlatDataFromInfiniteQuery(booksData);
            const flatDataFiltered = flatData.filter((current) => current.id === id);
            if (flatDataFiltered.length) {
                
                bookData = flatDataFiltered[0];
            }
        }

        // Set data
        if (bookData) {

            // From cache
            queryClient.setQueryData(["book", id], bookData);
        } else {

            // From Api
            refetch();
        }

        // Clean up
        return () => {

            // Cancel queries
            queryClient.cancelQueries({ queryKey: ["book", id], exact: true });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // Render(s)

    return (
        <div className={styles["page"]}>
            <Card
                name={data.name}
            />
        </div>
    );
};
export default Book;