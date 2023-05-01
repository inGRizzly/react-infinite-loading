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
import type { GetCharacterByIdResponseData } from "hooks/api/useApi";

// Import(s) - CSS
import styles from "pages/character/Character.module.css";

// Interfaces / Types
type PageParams = {
    id: string;
}

// Export - Page
const Character = () => {

    // Hook(s)

    const { id } = useParams<PageParams>();

    const {
        getCharacterById
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
    } = useQuery<GetCharacterByIdResponseData, Error>(
        ["character", id],
        (queryFunctionContext) => {

            const queryKeys: any[] = [...queryFunctionContext.queryKey];
            const currentId: string | undefined = queryKeys[1] || undefined;

            if (currentId) {
                return getCharacterById({ id: currentId, signal: queryFunctionContext.signal || undefined });
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
        let characterData = undefined;
        const charactersData: any = queryClient.getQueryData(["characters"]);
        if (charactersData) {
            const flatData = getFlatDataFromInfiniteQuery(charactersData);
            const flatDataFiltered = flatData.filter((current) => current.id === id);
            if (flatDataFiltered.length) {
                characterData = flatDataFiltered[0];
            }
        }

        // Set data
        if (characterData) {

            // From cache
            queryClient.setQueryData(["character", id], characterData);
        } else {

            // From Api
            refetch();
        }

        // Clean up
        return () => {

            // Cancel queries
            queryClient.cancelQueries({ queryKey: ["character", id], exact: true });
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
export default Character;