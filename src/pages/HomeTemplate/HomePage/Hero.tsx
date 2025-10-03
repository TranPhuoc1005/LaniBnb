import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

import { type CSSProperties } from "react";
import { Card, CardContent } from "@/components/ui/card";

const Hero = () => {
    const heroSlides = [
        { image: "../images/hero1.jpg" },
        { image: "../images/hero2.jpg" },
        { image: "../images/hero3.jpg" },
        { image: "../images/hero4.jpg" },
    ];

    const clouds = [
        { src: "./images/cloud1.png", i: 1 },
        { src: "./images/cloud2.png", i: 2 },
        { src: "./images/cloud3.png", i: 3 },
        { src: "./images/cloud4.png", i: 4 },
        { src: "./images/cloud5.png", i: 5 },
        { src: "./images/cloud1.png", i: 10 },
        { src: "./images/cloud2.png", i: 9 },
        { src: "./images/cloud3.png", i: 8 },
        { src: "./images/cloud4.png", i: 7 },
        { src: "./images/cloud5.png", i: 6 },
    ];

    return (
        <section className="relative w-full h-[750px] overflow-hidden">
            <Swiper
                modules={[Autoplay, Pagination, Navigation, EffectFade]}
                effect="fade"
                loop
                autoplay
                navigation={false}
                speed={1200}
                watchOverflow
                watchSlidesProgress
                className="wink-hero-swiper"
            >
                {heroSlides.map((slide, idx) => (
                    <SwiperSlide key={idx}>
                        <div
                            className="hero-bg"
                            style={{ backgroundImage: `url(${slide.image})` }}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className="hero-content">
                <Card className="bg-transparent border-0 shadow-none">
                    <CardContent className="hero-text-container">
                        <h1 className="hero-title">
                            <span>LaniBnb</span>
                            <span>LaniBnb</span>
                        </h1>
                    </CardContent>
                </Card>
            </div>

            <div className="banner">
                <div className="clouds">
                    {clouds.map((c, idx) => (
                        <img
                            key={idx}
                            src={c.src}
                            style={{ "--i": c.i } as CSSProperties}
                            alt=""
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hero;
