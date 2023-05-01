// Import(s) - Core
import { createContext, useContext, useEffect, useState } from "react";

// Import(s) - Component
import { Outlet } from "react-router";
import { Link } from "react-router-dom";
import { Nav } from "components/appLayout/Nav";

// Import(s) - SVG
import { AppLogo } from "svg/AppLogo";

// Import(s) - CSS
import styles from "pages/AppLayout.module.css";

// Interfaces / Types
type DisplayOrientation = "portrait" | "landscape";
interface ContextProps {
    displayOrientation: DisplayOrientation;
}

// Context
const Context = createContext<ContextProps>({} as ContextProps);

// Export - Page
const AppLayout = () => {

    // State(s)

    const [displayOrientation, setDisplayOrientation] = useState<DisplayOrientation>(() => {
        if (window.innerHeight >= window.innerWidth) {
            return "portrait";
        }
        return "landscape";
    });
    const [showNav, setShowNav] = useState(false);

    // Effect - to listen window resize AND set display orientation

    useEffect(() => {

        const handleWindowResize = () => {

            if (window.innerHeight >= window.innerWidth) {
                setDisplayOrientation("portrait");
            } else {
                setDisplayOrientation("landscape");
            }
        };

        window.addEventListener("resize", handleWindowResize);

        // Clean up
        return () => {
            window.removeEventListener("resize", handleWindowResize);
        };
    }, []);

    // Render(s)

    return (
        <Context.Provider value={{
            displayOrientation
        }}>
            <div className={styles["container"]}>

                {/* Nav */}
                <div className={styles["nav-container"]}>

                    <header className={styles["nav-header"]}>

                        {/* Logo */}
                        <div className={styles["logo-container"]}>

                            <Link to="/" className={styles["logo"]} aria-label="App's logo">
                                <AppLogo width="100%" height="4rem" />
                            </Link>
                        </div>

                        {/* Button to open nav */}
                        {displayOrientation === "portrait" &&
                            <button
                                className={styles["menu-button"]}
                                type="button"
                                aria-label="menu button"
                                onClick={() => {
                                    setShowNav((current) => !current);
                                }}
                            >
                                {showNav &&
                                    <span>close </span>
                                }
                                {!showNav &&
                                    <span>open </span>
                                }
                                <span>menu</span>
                            </button>
                        }
                    </header>

                    <nav
                        className={styles["nav"]}
                        style={{
                            transition: (displayOrientation === "landscape") ? "none" : "transform 0.4s ease-in-out",
                            transform: (displayOrientation === "landscape" || showNav) ? "translateX(0%)" : "translateX(-100%)"
                        }}
                    >

                        <Nav />
                    </nav>
                </div>

                {/* Main */}
                <main className={styles["outlet"]}>

                    <Outlet />
                </main>
            </div>
        </Context.Provider>
    );
};
export default AppLayout;

// Export - Hook
export const useAppLayout = () => {
    return useContext(Context);
};