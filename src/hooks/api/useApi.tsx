// Import(s) - Core
import { useState, useCallback, useEffect } from "react";
import axios from "axios";

// Import(s) - Utils
import { parseLinkHeader } from "utils/_core/parseLinkHeader";

// Import(s) - Interfaces / Types
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// Interfaces / Types - Character
export interface GetCharacterByIdResponseData {
    name?: string;
    aliases?: string[];
    tvSeries?: string[];
};

// Interfaces / Types - Book
export interface GetBookByIdResponseData {
    name?: string;
    isbn?: string;
    authors?: string[];
};

// Interfaces / Types - Commons
interface ApiLinkHeaderObject {
    url?: string;
    rel?: string;
    page?: string;
    pageSize?: string;
}
interface ApiLinkHeader {
    first?: ApiLinkHeaderObject;
    last?: ApiLinkHeaderObject;
    next?: ApiLinkHeaderObject;
    prev?: ApiLinkHeaderObject;
}
export interface GetListResponseData {
    id?: string;
    name?: string;
}
export interface GetListResponse {
    pageIndex: number;
    paginationInfo: ApiLinkHeader;
    data: GetListResponseData[] | GetCharacterByIdResponseData[] | GetBookByIdResponseData[];
}
interface GetListParams {
    page: number;
    signal?: AbortSignal;
}
export type GetListByNameResponse = GetListResponseData[] | GetCharacterByIdResponseData[] | GetBookByIdResponseData[];
export interface GetListByNameParams {
    name: string;
    signal?: AbortSignal;
}
export interface GetByIdParams {
    id: string;
    signal?: AbortSignal;
}

// Interfaces / Types - Context
export interface UseApiContext {
    // GET
    getCharacters: (params: GetListParams) => Promise<GetListResponse>;
    getCharactersByName: (params: GetListByNameParams) => Promise<GetListByNameResponse>;
    getBooks: (params: GetListParams) => Promise<GetListResponse>;
    getBooksByName: (params: GetListByNameParams) => Promise<GetListByNameResponse>;
    getCharacterById: (params: GetByIdParams) => Promise<GetCharacterByIdResponseData>;
    getBookById: (params: GetByIdParams) => Promise<GetBookByIdResponseData>;
}

// Interfaces / Types - Props
export interface UseApiProps {
    baseURL?: string;
}

// Export - Hook

/**
 * 
 * {@link UseApiProps}
 * {@link UseApiContext}
 * 
 */
export const useApi = (props: UseApiProps): UseApiContext => {

    // Props

    const {
        baseURL = ""
    } = props;

    // State(s)

    const [axiosInstance] = useState<AxiosInstance>(() => {
        return axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    });

    // Axios function(s)

    const makeAxiosRequest = async (requestConfig: AxiosRequestConfig, rawResponse?: boolean) => {
        try {

            if (!axiosInstance) {
                throw new Error("no axios instance found");
            }

            const response: AxiosResponse = await axiosInstance.request(requestConfig);
            return rawResponse ? response : response.data;
        } catch (error: any) {
            throw error;
        }
    };

    // Constant(s)

    const getList = useCallback<(params: GetListParams, type: "characters" | "books") => Promise<GetListResponse>>(async (params, type) => {
        try {

            // Define variable(s)
            const {
                page,
                signal
            } = params;

            // Build request parameters
            const url = type + "?page=" + page + "&pageSize=50";
            const method = "get";

            // Make request
            const res = await makeAxiosRequest({
                method,
                url,
                signal
            }, true);

            // Return result
            let data: GetListResponseData[] = [];
            let linkHeader: ApiLinkHeader | null | undefined = {};
            if (res) {

                data = (res.data || []).reduce((acc: any, currentData: any) => {

                    const currentAcc = [...acc];

                    const {
                        name,
                        url
                    } = currentData;

                    if (name && name.length > 0) {

                        const urlArray = url.split(type + "/");
                        const id = urlArray[1];

                        if (id) {

                            // // V1 - Without cache strategy
                            // currentAcc.push({
                            //     id,
                            //     name
                            // });

                            // V2 - With cache strategy
                            if (type === "characters") {

                                currentAcc.push({
                                    id,
                                    name,
                                    aliases: currentData.aliases,
                                    tvSeries: currentData.tvSeries
                                });
                            } else if (type === "books") {

                                currentAcc.push({
                                    id,
                                    name,
                                    isbn: currentData.isbn,
                                    authors: currentData.authors
                                });
                            }
                        }
                    }

                    return currentAcc;
                }, []);

                linkHeader = parseLinkHeader(res.headers.get("link"));
            }

            return {
                pageIndex: page,
                paginationInfo: linkHeader || {},
                data: data || []
            };
        } catch (error) {
            throw error;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getListByName = useCallback<(params: GetListByNameParams, type: "characters" | "books") => Promise<GetListByNameResponse>>(async (params, type) => {
        try {

            // Define variable(s)
            const {
                name,
                signal
            } = params;

            // Build request parameters
            const url = type + "?name=" + name + "&pageSize=50";
            const method = "get";

            // Make request
            const res = await makeAxiosRequest({
                method,
                url,
                signal
            }, true);

            // Return result
            let data: GetListResponseData[] = [];
            if (res) {

                data = (res.data || []).reduce((acc: any, currentData: any) => {

                    const currentAcc = [...acc];

                    const {
                        name,
                        url
                    } = currentData;

                    if (name && name.length > 0) {

                        const urlArray = url.split(type + "/");
                        const id = urlArray[1];

                        if (id) {

                            // // V1 - Without cache strategy
                            // currentAcc.push({
                            //     id,
                            //     name
                            // });

                            // V2 - With cache strategy
                            if (type === "characters") {

                                currentAcc.push({
                                    id,
                                    name,
                                    aliases: currentData.aliases,
                                    tvSeries: currentData.tvSeries
                                });
                            } else if (type === "books") {

                                currentAcc.push({
                                    id,
                                    name,
                                    isbn: currentData.isbn,
                                    authors: currentData.authors
                                });
                            }
                        }
                    }

                    return currentAcc;
                }, []);
            }

            return data || [];
        } catch (error) {
            throw error;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getById = useCallback<(params: GetByIdParams, type: "characters" | "books") => Promise<GetCharacterByIdResponseData | GetBookByIdResponseData>>(async (params, type) => {
        try {

            // Define variable(s)
            const {
                id,
                signal
            } = params;

            // Build request parameters
            const url = type + "/" + id;
            const method = "get";

            // Make request
            const res = await makeAxiosRequest({
                method,
                url,
                signal
            }, true);

            // Return result
            let data: Partial<GetCharacterByIdResponseData | GetBookByIdResponseData> = {};
            if (res) {
                data = res.data;
            }

            return data || {};
        } catch (error) {
            throw error;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Get method(s)

    const getCharacters = useCallback<(params: GetListParams) => Promise<GetListResponse>>(async (params) => {
        return getList(params, "characters");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getCharactersByName = useCallback<(params: GetListByNameParams) => Promise<GetListByNameResponse>>(async (params) => {
        return getListByName(params, "characters");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getBooks = useCallback<(params: GetListParams) => Promise<GetListResponse>>(async (params) => {
        return getList(params, "books");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getBooksByName = useCallback<(params: GetListByNameParams) => Promise<GetListByNameResponse>>(async (params) => {
        return getListByName(params, "books");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getCharacterById = useCallback<(params: GetByIdParams) => Promise<GetCharacterByIdResponseData>>(async (params) => {
        return getById(params, "characters");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getBookById = useCallback<(params: GetByIdParams) => Promise<GetBookByIdResponseData>>(async (params) => {
        return getById(params, "books");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Effect - To update baseURL

    useEffect(() => {
        axiosInstance.defaults.baseURL = baseURL;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [baseURL]);

    // Return
    return {
        // GET Method(s)
        getCharacters,
        getCharactersByName,
        getBooks,
        getBooksByName,
        getCharacterById,
        getBookById
    };
};