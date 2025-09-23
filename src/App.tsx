import { useRoutes } from "react-router-dom";
import "./App.css";
import { routes } from "./routes";
import ScrollToTop from "./components/layout/ScrollToTop";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

function App() {
    const routerElements = useRoutes(routes);
    useEffect(() => {
        AOS.init({
            duration: 1500,
            once: true,
            offset: 100,
        });
    }, []);
    return (
        <>
            <ScrollToTop />
            {routerElements}
        </>
    );
}

export default App;
