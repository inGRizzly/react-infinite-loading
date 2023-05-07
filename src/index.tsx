// Import(s) - Core
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";

// Import(s) - Component
import App from "App";

// Import(s) - CSS
import "index.css";
import "css/_font__core.css";

// Init App
const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <BrowserRouter>
        {/* <React.StrictMode>
            <App />
        </React.StrictMode> */}
        <App />
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
