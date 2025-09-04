import React, { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../../component/Loading/Loading";
import { useQuery } from "@tanstack/react-query";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Card from "../../component/card/Card";

const API_KEY = "9f51d8297f25ad990d37941955830af6";

export default function Home() {
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const navigate = useNavigate();

  const { data, isError, isLoading } = useQuery({
    queryKey: ["home"],
    queryFn: async () => {
      const [trendingRes, topRatedRes, tvRes] = await Promise.all([
        axios.get(
          `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`
        ),
        axios.get(
          `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`
        ),
        axios.get(
          `https://api.themoviedb.org/3/trending/tv/day?api_key=${API_KEY}`
        ),
      ]);
      return {
        trendingMovies: trendingRes.data.results,
        topRatedMovies: topRatedRes.data.results,
        trendingTV: tvRes.data.results,
      };
    },
  });

  // تهيئة AOS بعد تحميل البيانات
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, [data]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[100vh] overflow-x-hidden">
        <Loading />
      </div>
    );

  if (isError) return <p className="text-red-500">Something went wrong!</p>;

  const { trendingMovies, topRatedMovies, trendingTV } = data;

  // جلب Trailer
  const getTrailer = async (movieId, type = "movie") => {
    try {
      const url =
        type === "movie"
          ? `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`
          : `https://api.themoviedb.org/3/tv/${movieId}/videos?api_key=${API_KEY}&language=en-US`;

      const { data } = await axios.get(url);
      const trailer = data.results.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
      );
      if (trailer) setSelectedTrailer(trailer.key);
      else alert("Trailer not available");
    } catch (err) {
      console.log(err);
    }
  };

  // Slider مدمج مع AOS
  const renderSlider = (movies, type = "movie") => {
    const sliderMovies = movies
      .filter((m) => m.backdrop_path || m.poster_path)
      .slice(0, 5);
    return (
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={20}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 4000 }}
        pagination={{ clickable: true }}
        navigation
        className="mb-8 rounded-xl overflow-hidden w-full"
      >
        {sliderMovies.map((movie, index) => (
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
              data-aos="fade-up"
              data-aos-delay={index * 200}
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
  };

  // Cards مع AOS
  const renderMovies = (movies, count = 8, type = "movie", animation = "fade-up") => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-full">
      {movies.slice(0, count).map((movie, index) => (
        <div key={movie.id} data-aos={animation} data-aos-delay={index * 100}>
          <Card movie={movie} type={type} getTrailer={getTrailer} />
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen p-6 overflow-x-hidden">
      {trendingMovies.length > 0 && renderSlider(trendingMovies, "movie")}

      <h2 className="text-2xl font-bold mb-6 mt-8 text-blue-400">
        Trending Movies
      </h2>
      {renderMovies(trendingMovies, 8, "movie", "fade-up")}

      <h2 className="text-2xl font-bold mb-6 mt-8 text-blue-400">
        Top Rated Movies
      </h2>
      {renderMovies(topRatedMovies, 8, "movie", "fade-right")}

      <h2 className="text-2xl font-bold mb-6 mt-8 text-blue-400">
        Trending TV Series
      </h2>
      {renderMovies(trendingTV, 8, "tv", "fade-left")}

      {/* Trailer Modal */}
      {selectedTrailer && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative w-full max-w-3xl">
            <iframe
              width="100%"
              height="500"
              src={`https://www.youtube.com/embed/${selectedTrailer}`}
              title="Movie Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <button
              className="absolute top-2 right-2 text-white text-2xl font-bold"
              onClick={() => setSelectedTrailer(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
