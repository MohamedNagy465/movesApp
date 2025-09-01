import React from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function Slider({ movies, type = "movie" }) {
  const navigate = useNavigate();

  if (!movies || movies.length === 0) return null;

  // ناخد أول 5 أفلام مع التأكد إن في صورة
  const sliderMovies = movies.filter(m => m.backdrop_path || m.poster_path).slice(0, 5);

  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      spaceBetween={20}
      slidesPerView={1}
      loop={true}
      autoplay={{ delay: 4000 }}
      pagination={{ clickable: true }}
      navigation
      className="mb-8 rounded-xl overflow-hidden"
    >
      {sliderMovies.map((movie) => (
        <SwiperSlide key={movie.id}>
          <div
            className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden cursor-pointer"
            onClick={() =>
              navigate(
                type === "movie"
                  ? `/movieDetails/${movie.id}`
                  : `/tvDetails/${movie.id}`
              )
            }
          >
            <img
              className="w-full h-full object-cover"
              src={
                movie.backdrop_path
                  ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
                  : `https://image.tmdb.org/t/p/original${movie.poster_path}`
              }
              alt={movie.title || movie.name}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

            <div className="absolute bottom-4 left-4 text-white">
              <h2 className="text-xl md:text-3xl font-bold truncate max-w-[80%]">
                {movie.title || movie.name}
              </h2>
              {movie.vote_average && (
                <p className="text-yellow-400 mt-1">
                  ⭐ {movie.vote_average.toFixed(1)} / 10
                </p>
              )}
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
