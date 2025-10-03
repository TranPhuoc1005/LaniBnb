import { useEffect } from "react";
import "./_home.scss";
import "../_components/scss/styles.scss";
import Booking from "./Booking";
import AboutUs from "./AboutUs";
import ListRoom from "./ListRoom";
import Comments from "./Comments";
import Hero from "./Hero";
import { useLocation } from "react-router-dom";

export default function HomePage() {
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            const el = document.querySelector(location.hash) as HTMLElement;
            if (el) {
                const y = el.getBoundingClientRect().top + window.scrollY - 30;
                window.scrollTo({ top: y, behavior: "smooth" });
            }
        }
    }, [location]);

    return (
        <>
            {/* Hero Section */}
            <Hero />

            {/* Booking Section */}
            <Booking />

            {/* About Section */}
            <AboutUs />

            {/* Rooms Section */}
            <ListRoom />

            {/* Comments Section */}
            <Comments />
        </>
    );
}
