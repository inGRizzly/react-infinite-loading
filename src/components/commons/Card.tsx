// Import(s) - CSS
import styles from "components/commons/Card.module.css";

// Interfaces / Types
export interface CardProps {
    name?: string;
}

// Export - Component

/**
 * 
 * {@link CardProps}
 * 
 */
export const Card = (props: CardProps) => {

    // Props

    const {
        name = "unknow"
    } = props;

    // Render(s)

    return (
        <div className={styles["card"]}>

            <div className={styles["card-header"]}>

                <h1 className={styles["card-header__title"]}>
                    {name}
                </h1>
            </div>

            <div className={styles["card-content"]}>
                ...
            </div>
        </div>
    );
};