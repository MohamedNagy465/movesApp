import React, { useState } from "react";
import axios from "axios";
import Loading from "../../component/Loading/Loading";
import Slider from "../../component/slider/Slider";
import Card from "../../component/card/Card";
import { useQuery } from "@tanstack/react-query";

const API_KEY = "9f51d8297f25ad990d37941955830af6";

export default function Home() {
  const [selectedTrailer, setSelectedTrailer] = useState(null);

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

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[100vh]">
        <Loading />
      </div>
    );

  if (isError) return <p className="text-red-500">Something went wrong!</p>;

  const { trendingMovies, topRatedMovies, trendingTV } = data;

  // دالة جلب Trailer
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

  // عرض الأفلام/المسلسلات باستخدام Card
  const renderMovies = (movies, count = 8, type = "movie") => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {movies.slice(0, count).map((movie) => (
        <Card
          key={movie.id}
          movie={movie}
          type={type}
          getTrailer={getTrailer}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen p-6">
      {trendingMovies.length > 0 && (
        <Slider movies={trendingMovies} getTrailer={getTrailer} />
      )}

      <h2 className="text-2xl font-bold mb-6 mt-8 text-blue-400">
        Trending Movies
      </h2>
      {renderMovies(trendingMovies)}

      <h2 className="text-2xl font-bold mb-6 mt-8 text-blue-400">
        Top Rated Movies
      </h2>
      {renderMovies(topRatedMovies)}

      <h2 className="text-2xl font-bold mb-6 mt-8 text-blue-400">
        Trending TV Series
      </h2>
      {renderMovies(trendingTV, 8, "tv")}

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
