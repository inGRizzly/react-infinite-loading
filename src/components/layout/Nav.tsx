// Import(s) - Core
import { useEffect, useState, useRef } from "react";

// Import(s) - Component
import { SearchBar } from "components/_core/SearchBar";
import { Selector } from "components/commons/Selector";
import { List } from "components/layout/nav/List";

// Import(s) - SVG
import { SearchIcon } from "svg/Icon";

// Import(s) - CSS
import styles from "components/layout/Nav.module.css";

// Export - Component
export const Nav = () => {
    // Ref(s)

    const internalStatesRef = useRef<{
        charactersListScrollTop: number;
        booksListScrollTop: number;
    }>({
        charactersListScrollTop: 0,
        booksListScrollTop: 0
    });

    // State(s)

    const [searchFilterValue, setSearchFilterValue] = useState<string>("");
    const [activeSelector, setActiveSelector] = useState<
        "characters" | "books"
    >("characters");
    const [charactersListScrollTop, setCharactersListScrollTop] =
        useState<number>(internalStatesRef.current.charactersListScrollTop);
    const [charactersListIsLoading, setCharactersListIsLoading] =
        useState<boolean>(true);
    const [booksListScrollTop, setBooksListScrollTop] = useState<number>(
        internalStatesRef.current.booksListScrollTop
    );
    const [booksListIsLoading, setBooksListIsLoading] = useState<boolean>(true);

    // Effect - to listen the active selector AND set the index position on scroll of the previous list displayed

    useEffect(() => {
        if (activeSelector === "books") {
            setCharactersListScrollTop(
                internalStatesRef.current.charactersListScrollTop
            );
        } else if (activeSelector === "characters") {
            setBooksListScrollTop(internalStatesRef.current.booksListScrollTop);
        }
    }, [activeSelector]);

    // Render(s)

    return (
        <div className={styles["container"]}>
            {/* Top bar */}
            <div className={styles["top-bar"]}>
                <div className={styles["search-bar_container"]}>
                    <SearchBar
                        className={styles["search-bar"]}
                        classNameFocused={styles["search-bar_focused"]}
                        icon={
                            <div style={{ marginRight: "0.4rem" }}>
                                <SearchIcon
                                    color="var(--app-text-color-light)"
                                    width="1.4rem"
                                />
                            </div>
                        }
                        inputClassName={styles["search-bar__input"]}
                        placeholder="Search"
                        disabled={
                            activeSelector === "characters"
                                ? charactersListIsLoading
                                    ? true
                                    : false
                                : booksListIsLoading
                                ? true
                                : false
                        }
                        value={searchFilterValue}
                        onChange={(value) => {
                            setSearchFilterValue(value);
                        }}
                    />
                </div>
            </div>

            {/* Selectors */}
            <div className={styles["selectors-container"]}>
                <Selector
                    highlightColor="var(--app-secondary-background-contrast)"
                    isActive={activeSelector === "characters"}
                    onClick={() => {
                        setActiveSelector("characters");
                    }}
                    aria-label="selector"
                    className={styles["selector"]}
                >
                    <span>Characters</span>
                </Selector>

                <Selector
                    highlightColor="var(--app-secondary-background-contrast)"
                    isActive={activeSelector === "books"}
                    onClick={() => {
                        setActiveSelector("books");
                    }}
                    aria-label="selector"
                    className={styles["selector"]}
                    containerStyle={{
                        marginLeft: "0.4rem"
                    }}
                >
                    <span>Books</span>
                </Selector>
            </div>

            {/* Lists Component */}
            <div className={styles["list-container"]}>
                <div className={styles["list"]}>
                    {/* Characters list */}
                    {activeSelector === "characters" && (
                        <List
                            key="Nav-List-characters"
                            type="characters"
                            onScroll={(scrollValue) => {
                                internalStatesRef.current.charactersListScrollTop =
                                    scrollValue;
                            }}
                            initialScrollTop={charactersListScrollTop}
                            onLoaded={() => setCharactersListIsLoading(false)}
                            filter={
                                searchFilterValue.length >= 3
                                    ? searchFilterValue
                                    : undefined
                            }
                        />
                    )}

                    {/* Books list */}
                    {activeSelector === "books" && (
                        <List
                            key="Nav-List-books"
                            type="books"
                            onScroll={(scrollValue) => {
                                internalStatesRef.current.booksListScrollTop =
                                    scrollValue;
                            }}
                            initialScrollTop={booksListScrollTop}
                            onLoaded={() => setBooksListIsLoading(false)}
                            filter={
                                searchFilterValue.length >= 3
                                    ? searchFilterValue
                                    : undefined
                            }
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
