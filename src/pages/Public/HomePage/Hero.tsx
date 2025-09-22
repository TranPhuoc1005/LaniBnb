import React, { type CSSProperties } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import 'swiper/css/effect-fade';

const Hero = () => {
    const heroSlides = [
        {
            image: "../images/hero1.jpg"
        },
        {
            image: "../images/hero2.jpg"
        },
        {
            image: "../images/hero3.jpg"
        },
        {
            image: "../images/hero4.jpg"
        }
    ];

    return (
        <section className="relative w-full h-[750px] overflow-hidden">
            <Swiper
                modules={[Autoplay, Pagination, Navigation, EffectFade]}
                effect="fade"
                loop
                autoplay={true}
                navigation={false}
                speed={1200}
                watchOverflow={true}
                watchSlidesProgress={true}
                className="wink-hero-swiper"
            >
                {heroSlides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <div 
                            className="hero-bg" 
                            style={{backgroundImage: `url(${slide.image})`}}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className="hero-content">
                <div className="hero-text-container">
                    <h1 className="hero-title">
                        <span>LaniBnb</span>
                        <span>LaniBnb</span>
                    </h1>
                </div>
            </div>

            {/* Wink Clouds Animation */}
            <div className="banner">
                <div className="clouds">
                    <img src="./images/cloud1.png" style={{"--i":1} as CSSProperties} alt="" />
                    <img src="./images/cloud2.png" style={{"--i":2} as CSSProperties} alt="" />
                    <img src="./images/cloud3.png" style={{"--i":3} as CSSProperties} alt="" />
                    <img src="./images/cloud4.png" style={{"--i":4} as CSSProperties} alt="" />
                    <img src="./images/cloud5.png" style={{"--i":5} as CSSProperties} alt="" />
                    <img src="./images/cloud1.png" style={{"--i":10} as CSSProperties} alt="" />
                    <img src="./images/cloud2.png" style={{"--i":9} as CSSProperties} alt="" />
                    <img src="./images/cloud3.png" style={{"--i":8} as CSSProperties} alt="" />
                    <img src="./images/cloud4.png" style={{"--i":7} as CSSProperties} alt="" />
                    <img src="./images/cloud5.png" style={{"--i":6} as CSSProperties} alt="" />
                </div>
            </div>
        </section>
    );
};

export default Hero;