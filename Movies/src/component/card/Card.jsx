import React from "react";
import { useNavigate } from "react-router-dom";

export default function Card({ movie, type = "movie", getTrailer }) {
  const navigate = useNavigate();

  const title = movie.title || movie.name || "Untitled";
  const poster = movie.poster_path || movie.backdrop_path;
  const rating = movie.vote_average || 0;

  // ✅ لو مفيش صورة، الكارد مش هيتعرض أصلاً
  if (!poster) return null;

  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition p-2">
      {/* الصورة للتفاصيل */}
      <div
        className="relative cursor-pointer"
        onClick={() => navigate(`/${type}Details/${movie.id}`)}
      >
        <img
          className="w-full rounded-xl object-cover h-52 transform transition duration-300 hover:scale-105"
          src={`https://image.tmdb.org/t/p/w500${poster}`}
          alt={title}
        />
      </div>

      {/* العنوان + التقييم */}
      <h3 title={title} className="mt-2 text-lg font-semibold truncate text-black">
        {title}
      </h3>
      <p className="text-sm text-yellow-500 font-semibold">
        ⭐ {rating.toFixed(1)} / 10
      </p>

      {/* زر التريلر */}
      {getTrailer && (
        <button
          onClick={() => getTrailer(movie.id, type)}
          className="mt-3 w-full bg-red-500 text-white py-2 rounded-xl hover:bg-red-600 transition"
        >
          ▶ Watch Trailer
        </button>
      )}
    </div>
  );
}
