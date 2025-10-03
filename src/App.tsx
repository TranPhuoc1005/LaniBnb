import { useRoutes } from "react-router-dom";
import { routes } from "./routes";
import ScrollToTop from "./components/layouts/ScrollToTop";

function App() {
    const elementRoutes = useRoutes(routes);
    return (
        <>
            <ScrollToTop />
            {elementRoutes}
        </>
    );
}

export default App;
