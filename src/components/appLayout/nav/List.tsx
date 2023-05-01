// Import(s) - Core
import { useEffect, useState, useRef, useMemo } from "react";

// Import(s) - Hook
import { useApi } from "hooks/api/useApi";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

// Import(s) - Component
import { VirtualizedList } from "components/_core/VirtualizedList";
import { NavLink } from "react-router-dom";

// Import(s) - Utils
import { getFlatDataFromInfiniteQuery } from "utils/nav/getFlatDataFromInfiniteQuery";

// Import(s) - Interfaces / Types
import type { GetListResponse, GetListResponseData } from "hooks/api/useApi";

// Import(s) - CSS
import styles from "components/appLayout/nav/List.module.css";

// Interfaces / Types
export interface ListProps {
    type: "characters" | "books";
    onScroll?: (scrollValue: number) => void;
    initialScrollTop?: number;
    onLoaded?: () => void;
    filter?: string | undefined | null;
}

// Export - Component

/**
 * 
 * {@link ListProps}
 * @todo
 * ```
 *  - Add 'prev' support to optimize data size
 * 
 * ```
 * 
 */
export const List = (props: ListProps) => {

    // Props

    const {
        type,
        onScroll = undefined,
        initialScrollTop = undefined,
        onLoaded = undefined,
        filter = undefined
    } = props;

    // Ref(s)

    const internalStatesRef = useRef<{
        hasNextPage: boolean;
        filter: string | undefined | null;
    }>({
        hasNextPage: false,
        filter
    });

    // State(s)

    const [filteredDataError, setFilteredDataError] = useState<boolean>(false);

    // Hook(s)

    const {
        getCharacters,
        getCharactersByName,
        getBooks,
        getBooksByName
    } = useApi({
        baseURL: "https://www.anapioficeandfire.com/api/"
    });

    // API call(s)

    const {
        data,
        // error, // TODO: toast
        fetchNextPage,
        isLoading
    } = useInfiniteQuery(
        // Query key(s)
        [type],
        // Query function
        ({ pageParam = 1, signal }) =>
        (type === "characters" ?
            getCharacters({ page: pageParam, signal }) :
            getBooks({ page: pageParam, signal })
        )
        ,
        {
            getNextPageParam: (lastPage: GetListResponse) => {

                const {
                    paginationInfo: lastPagePaginationInfo = {}
                } = lastPage;

                const {
                    next = undefined
                } = lastPagePaginationInfo;

                if (next && next.page) {

                    // Update internal hasNextPage state
                    internalStatesRef.current.hasNextPage = true;

                    // Return next page number
                    return parseInt(next.page, 10) || 1;
                }

                // Update internal hasNextPage state
                internalStatesRef.current.hasNextPage = false;

                // Return false means no next page
                return false;
            }
        }
    );

    const {
        data: filteredData = [],
        isFetching: filteredDataIsFetching
    } = useQuery<never[] | Partial<GetListResponseData>[], Error>(
        ["filtered-" + type, filter],
        (queryFunctionContext) => {

            const queryKeys: any[] = [...queryFunctionContext.queryKey];

            const currentFilter: string | undefined = queryKeys[1] || undefined;

            if (!currentFilter) {

                return [];
            } else {

                if (type === "characters") {
                    return getCharactersByName({ name: currentFilter, signal: queryFunctionContext.signal || undefined });
                } else {
                    return getBooksByName({ name: currentFilter, signal: queryFunctionContext.signal || undefined });
                }
            }
        },
        {
            onError: () => setFilteredDataError(true),
            onSuccess: () => setFilteredDataError(false),
            retry: 0,
            cacheTime: 1000 * 60 * 5, // 5 minutes
            staleTime: 0
        }
    );

    // Effect - To exec onLoaded

    useEffect(() => {

        if (!isLoading) {

            if (onLoaded && typeof onLoaded === "function") {
                onLoaded();
            }
        }
    }, [isLoading, onLoaded]);

    // Effect - To listen filter

    useEffect(() => {

        // Update internal filter state
        internalStatesRef.current.filter = filter;
    }, [filter]);

    // Render(s)

    const DataToUse = useMemo(() => {

        if (filter && filteredData) {

            return filteredData;
        }

        const flatData = getFlatDataFromInfiniteQuery(data, { checkDuplicateKey: "id" }) || [];

        // return sortArrayByObjectKey(flatData, "name") || []; // TODO: sorting = visual glitch on page fetching (Need to be fixed before to use)
        return flatData;
    }, [filteredData, filter, data]);

    if (isLoading) {

        return (
            <div>
                loading...
            </div>
        );
    }

    if (filter) {

        if (filteredDataIsFetching) {

            return (
                <div>
                    searching...
                </div>
            );
        } else if (filteredDataError || filteredData.length === 0) {

            return (
                <div>
                    no match found
                </div>
            );
        }
    }

    return (
        <VirtualizedList
            data={DataToUse}
            // totalCount={DataToUse.length} // TODO: this causes multiple fetches of the same page?
            endReached={() => {
                if (!internalStatesRef.current.filter && internalStatesRef.current.hasNextPage) {
                    fetchNextPage();
                }
            }}
            initialScrollTop={initialScrollTop}
            onScroll={onScroll ? (e) => {

                const container = e?.target as HTMLElement | null | undefined;
                let scrollY = 0;

                if (container) {
                    scrollY = container.scrollTop || 0;
                }

                if (onScroll && typeof onScroll === "function") {

                    onScroll(scrollY);
                }
            } : undefined}
            increaseViewportBy={window.innerHeight} // TODO
            overscan={window.innerHeight} // TODO: from parent height
            itemContent={(_, item) => {

                const {
                    id = undefined,
                    name = undefined
                } = item;

                return (
                    <div
                        key={id}
                        role="listitem"
                        className={styles["item-container"]}
                    >

                        {(!id || !name) &&
                            <span className={styles["item"]}>error</span>
                        }

                        {(id && name) &&
                            <NavLink
                                to={(type === "characters" ? "character/" : "book/") + id}
                                className={styles["item"]}
                                style={({ isActive }) => {

                                    if (isActive) {
                                        return {
                                            backgroundColor: "var(--app-primary-color)",
                                            color: "var(--app-primary-color-contrast)"
                                        };
                                    }

                                    return {};
                                }}
                            >
                                {name}
                            </NavLink>
                        }
                    </div>
                );
            }}
        />
    );
};