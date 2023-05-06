// Import(s) - Core
import { useState, useId } from "react";

// Import(s) - CSS
import styles from "components/_core/SearchBar.module.css";

// Import(s) - Interfaces / Types
import type {
    ReactElement,
    ReactNode,
    InputHTMLAttributes,
    CSSProperties
} from "react";

// Interfaces / Types
export interface SearchBarProps extends
    Omit<InputHTMLAttributes<HTMLInputElement>,
        "aria-label" |
        "aria-labelledby" |
        "aria-describedby" |
        "id" |
        "className" |
        "style" |
        "value" |
        "onChange"
    > {
    "aria-label"?: string;
    "aria-labelledby"?: string;
    "aria-describedby"?: string;

    id?: string;

    className?: string;
    style?: CSSProperties;
    classNameFocused?: string;
    styleFocused?: CSSProperties;

    inputClassName?: string;
    inputStyle?: CSSProperties;

    icon?: ReactElement | ReactNode | null | undefined | (() => ReactElement);

    value?: string | number | undefined;
    onChange?: (value: string | undefined | null) => void;
}

// Export - Component

/**
 * 
 * {@link SearchBarProps}
 * 
 * @TODO
 * ```
 * - Need to add a debounce prop to apply a delay before to trigger onChange.
 * - Need to add cross to clear the input.
 * ```
 */
export const SearchBar = (props: SearchBarProps) => {

    // Prop(s)

    const {
        "aria-label": ariaLabel = "",
        "aria-labelledby": ariaLabelledby = "",
        "aria-describedby": ariaDescribedby = "",

        id = undefined,

        className = undefined,
        style = {},
        classNameFocused = undefined,
        styleFocused = undefined,

        inputClassName = undefined,
        inputStyle = {},

        icon = undefined,

        value = undefined,
        onChange = undefined,

        ...restInputProps
    } = props;

    // Uuid(s)

    const uuid: string = useId();

    // State(s)

    const [isFocused, setIsFocused] = useState<boolean>(false);

    // Render(s)

    return (
        <div
            role="search"
            className={
                (styles["container"] +
                    (className ? (" " + className) : "") +
                    ((classNameFocused && isFocused) ? " " + classNameFocused : ""))}
            style={{
                ...style,
                ...(styleFocused && isFocused) ? styleFocused : {},
                display: "flex",
                position: "relative",
                width: "100%",
                height: "auto"
            }}
        >

            {icon !== undefined && icon !== null &&
                <label
                    htmlFor={id || uuid}
                    aria-label={ariaLabel}
                    aria-labelledby={ariaLabelledby}
                    aria-describedby={ariaDescribedby}
                >
                    {typeof icon === "function" && icon()}
                    {typeof icon !== "function" && icon}
                </label>
            }

            <input
                {...restInputProps}
                role="searchbox"
                id={id || uuid}
                className={
                    (styles["input"] +
                        (inputClassName ? (" " + inputClassName) : ""))
                }
                style={inputStyle}
                type="text"
                onFocus={() => {
                    
                    setIsFocused(true);
                }}
                onBlur={() => {
                    
                    setIsFocused(false);
                }}
                value={value}
                onChange={(event) => {
                    
                    if (onChange && typeof onChange === "function") {
                        
                        onChange(event.target.value);
                    }
                }}
            />
        </div>
    );
};