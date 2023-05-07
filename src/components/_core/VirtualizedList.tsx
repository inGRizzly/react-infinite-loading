// Import(s) - Core
import { useRef } from "react";
import { Virtuoso } from "react-virtuoso";

// Import(s) Interfaces / Types
import type {
    VirtuosoProps,
    VirtuosoHandle,
    ListItem as OriginalListItem
} from "react-virtuoso";
import { CSSProperties, useEffect } from "react";

type ItemData = any;
type Context = any;

// Interfaces / Types
export type ListItem = OriginalListItem<any>[] | undefined;
export interface VirtualizedListProps
    extends Omit<VirtuosoProps<ItemData, Context>, "style"> {
    style?: CSSProperties;
    onInit?: (ctx: VirtuosoHandle | undefined) => void;
}

// Export - Component
export const VirtualizedList = (props: VirtualizedListProps) => {
    // Prop(s)

    const { style = {}, onInit = undefined, ...rest } = props;

    // Ref(s)

    const virtuosoRef = useRef<any>();

    // Effect - to exec on init

    useEffect(() => {
        if (virtuosoRef && virtuosoRef.current) {
            if (onInit && typeof onInit === "function") {
                onInit(virtuosoRef.current);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [virtuosoRef]);

    // Render(s)

    return (
        <Virtuoso
            role="list"
            style={{
                ...style,
                width: "100%",
                height: "100%"
            }}
            {...rest}
            ref={onInit ? virtuosoRef : undefined}
        />
    );
};
