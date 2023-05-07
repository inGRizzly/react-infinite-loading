// Import(s) - CSS
import styles from "pages/home/Home.module.css";

// Export - Page
const Home = () => {
    // Render(s)

    return (
        <div className={styles["page"]}>
            <div className={styles["text-content"]}>
                <h1 className={styles["title"]}>Welcome</h1>
                <p className={styles["description"]}>
                    to this demo App created to show how to implement the
                    infinite loading.
                </p>
            </div>
        </div>
    );
};
export default Home;
