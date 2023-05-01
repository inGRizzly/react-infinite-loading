// Import(s) - Core
import { lazy, Suspense, useState } from "react";
import { Routes, Route, Navigate } from "react-router";

// Import(s) - @tanstack/react-query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import(s) - App's Layout
import AppLayout from "pages/AppLayout";

// Import(s) - (lazy loaded) Pages
import BasicLoader from "pages/_loaders/BasicLoader";
const Home = lazy(() => import('pages/home/Home'));
const Character = lazy(() => import('pages/character/Character'));
const Book = lazy(() => import('pages/book/Book'));

// Export - App
const App = () => {

    // State(s)
    const [queryClient] = useState<QueryClient>(() => {

        return new QueryClient({
            defaultOptions: {
                queries: {
                    useErrorBoundary: false,
                    refetchOnMount: false,
                    refetchOnWindowFocus: false,
                    refetchOnReconnect: false
                }
            }
        });
    });

    // Render
    return (

        <QueryClientProvider client={queryClient}>

            <Routes>

                {/* AppLayout */}
                <Route
                    path="/"
                    element={(<AppLayout />)}
                >

                    {/* Home */}
                    <Route
                        index
                        element={(
                            <Suspense fallback={(<BasicLoader />)}>
                                <Home />
                            </Suspense>
                        )}
                    />

                    {/* Character */}
                    <Route
                        path="character/:id"
                        element={(
                            <Suspense fallback={(<BasicLoader />)}>
                                <Character />
                            </Suspense>
                        )}
                    />

                    {/* Book */}
                    <Route
                        path="book/:id"
                        element={(
                            <Suspense fallback={(<BasicLoader />)}>
                                <Book />
                            </Suspense>
                        )}
                    />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </QueryClientProvider>
    );
}
export default App;
