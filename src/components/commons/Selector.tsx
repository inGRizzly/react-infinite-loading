// Import(s) - Interfaces / Types
import type {
    ButtonHTMLAttributes,
    ReactElement,
    ReactNode,
    CSSProperties
} from "react";

// Import(s) - CSS
import styles from "components/commons/Selector.module.css";

// Interfaces / Types
export interface SelectorProps
    extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
    children: ReactElement | ReactNode | null | undefined;
    containerClassName?: string;
    containerStyle?: CSSProperties;

    highlightColor?: string;
    highlightHeight?: string;

    isActive?: boolean;
}

// Export - Component

/**
 *
 * {@link SelectorProps}
 *
 */
export const Selector = (props: SelectorProps) => {
    // Prop(s)

    const {
        children = null,
        containerClassName = undefined,
        containerStyle = {},

        highlightColor = "black",
        highlightHeight = "2px",

        isActive = false,

        ...rest
    } = props;

    // Render(s)

    return (
        <div
            className={
                styles["container"] +
                (containerClassName ? " " + containerClassName : "")
            }
            style={containerStyle}
        >
            <button {...rest} type="button">
                {children}
            </button>

            <div
                className={styles["highlight"]}
                style={{
                    background: highlightColor,
                    height: highlightHeight,
                    transform: isActive ? "scaleX(1)" : "scaleX(0)"
                }}
            ></div>
        </div>
    );
};
