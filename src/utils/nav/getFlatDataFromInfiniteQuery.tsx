// Import(s) - Interfaces / Types
import type { InfiniteData } from "@tanstack/react-query";
import type { GetListResponse, GetListResponseData } from "hooks/api/useApi";

// Export(s)

export const getFlatDataFromInfiniteQuery: (
        originalData: InfiniteData<GetListResponse> | null | undefined,
        options?: {
            checkDuplicateKey?: string;
        }
    ) => Partial<GetListResponseData>[]
    = (originalData, options) => {

    if (originalData) {

        const {
            checkDuplicateKey = undefined
        } = options || {};

        const flatData: Partial<GetListResponseData>[] = originalData.pages.map((currentDataPage) => {
            return currentDataPage.data;
        }).flat();

        if (!checkDuplicateKey) {
            return flatData;
        }

        const dataChecked = (flatData || []).reduce((acc: Partial<GetListResponseData>[], currentData: any) => {

            const currentAcc = [...acc];

            if (currentAcc.length > 0) {

                const isAlreadyPushed = currentAcc.find((current: any) => current[checkDuplicateKey] === currentData[checkDuplicateKey]);

                if (isAlreadyPushed) {
                    return currentAcc;
                } else {
                    currentAcc.push(currentData);
                }
            } else {
                currentAcc.push(currentData);
            }

            return currentAcc;
        }, []);
        return dataChecked;
    }

    return [];
};