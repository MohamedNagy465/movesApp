import React from "react"; 
import { useNavigate } from "react-router-dom";

export default function Card({ movie, type = "movie", getTrailer }) {
  const navigate = useNavigate();

  const title = movie.title || movie.name || "Untitled";
  const poster = movie.poster_path || movie.backdrop_path;
  const rating = movie.vote_average || 0;

  // لو مفيش صورة، الكارد مش هيتعرض أصلاً
  if (!poster) return null;

  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition p-2 flex flex-col">
      {/* الصورة للتفاصيل */}
      <div
        className="relative cursor-pointer w-full"
        onClick={() => navigate(`/${type}Details/${movie.id}`)}
      >
        <img
          className="w-full rounded-xl object-cover h-48 sm:h-52 md:h-60 lg:h-64 transform transition duration-300 hover:scale-105"
          src={`https://image.tmdb.org/t/p/w500${poster}`}
          alt={title}
        />
      </div>

      {/* العنوان + التقييم */}
      <h3
        title={title}
        className="mt-2 text-sm sm:text-base md:text-lg font-semibold text-black truncate"
      >
        {title}
      </h3>
      <p className="text-xs sm:text-sm md:text-base text-yellow-500 font-semibold">
        ⭐ {rating.toFixed(1)} / 10
      </p>

      {/* زر التريلر */}
      {getTrailer && (
        <button
          onClick={() => getTrailer(movie.id, type)}
          className="mt-2 sm:mt-3 w-full bg-red-500 text-white py-1 sm:py-2 rounded-xl hover:bg-red-600 transition text-xs sm:text-sm"
        >
          ▶ Watch Trailer
        </button>
      )}
    </div>
  );
}
