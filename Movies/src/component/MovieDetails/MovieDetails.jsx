import React, { useEffect, useState } from "react";  
import { useParams } from "react-router-dom";
import axios from "axios";
import Loading from "../../component/Loading/Loading";
import SimilarMovies from "../SimilarMovies/SimilarMovies";

const API_KEY = "9f51d8297f25ad990d37941955830af6";
const BASE_URL = "https://api.themoviedb.org/3";

export default function MovieDetails({ type = "movie" }) {
  const { id } = useParams();
  const [details, setDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trailerKey, setTrailerKey] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const resDetails = await axios.get(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=en-US`);
        setDetails(resDetails.data);

        const resCredits = await axios.get(`${BASE_URL}/${type}/${id}/credits?api_key=${API_KEY}&language=en-US`);
        setCast(resCredits.data.cast.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, type]);

  const getTrailer = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}`);
      const trailer = res.data.results.find(v => v.type === "Trailer" && v.site === "YouTube");
      if (trailer) setTrailerKey(trailer.key);
      else alert("🚫 No trailer available");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[100vh]">
        <Loading />
      </div>
    );  

  if (!details) return <p className="text-center text-red-500 mt-10">❌ No details found!</p>;

  return (
    <div className="relative text-white">
      {/* الخلفية */}
      <div className="relative w-full min-h-screen">
        {details.backdrop_path && (
          <img
            src={`https://image.tmdb.org/t/p/original${details.backdrop_path}`}
            alt={details.title || details.name}
            className="absolute inset-0 w-full h-full object-cover filter brightness-50"
          />
        )}

        <div className="relative z-10 flex flex-col md:flex-row gap-4 md:gap-8 p-4 md:p-6 max-w-6xl mx-auto h-full">
          {/* صورة الفيلم + زر التريلر */}
          <div className="flex flex-col items-center w-full md:w-1/4 mb-4 md:mb-0">
            <img
              className="rounded-lg w-52 md:w-full h-72 md:h-auto object-cover mb-4"
              src={
                details.poster_path
                  ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
                  : "https://via.placeholder.com/500x750?text=No+Image"
              }
              alt={details.title || details.name}
            />
            <button
              onClick={getTrailer}
              className="w-full md:w-auto bg-red-500 text-white p-2 rounded-xl hover:bg-red-600 transition"
            >
              ▶ Watch Trailer
            </button>
          </div>
          {/* التفاصيل + الممثلين */}
          <div className="flex-1 flex flex-col justify-between">
            <div className="space-y-4 mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-blue-400">{details.title || details.name}</h1>
              <p className="text-gray-300 text-sm md:text-base">{details.overview}</p>
              <div className="space-y-2">
                {/* Rating */}
                <div className="flex items-center gap-2 text-sm md:text-base">
                  <span className="font-semibold text-blue-400">Rating:</span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const starValue = (i + 1) * 2;
                      return (
                        <svg
                          key={i}
                          className={`w-4 h-4 md:w-5 md:h-5 ${details.vote_average * 2 >= starValue ? "text-yellow-400" : "text-gray-600"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.176 0l-3.38 2.454c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.047 9.393c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.966z"/>
                        </svg>
                      );
                    })}
                  </div>
                  <span className="text-gray-300">({details.vote_average ? details.vote_average.toFixed(1) : "N/A"})</span>
                </div>

                {/* معلومات إضافية */}
                <p className="text-gray-100"><span className="font-semibold text-blue-400">Votes:</span> {details.vote_count || "N/A"}</p>
                {details.release_date && <p className="text-gray-100"><span className="font-semibold text-blue-400">Release Date:</span> {details.release_date}</p>}
                {details.runtime && <p className="text-gray-100"><span className="font-semibold text-blue-400">Runtime:</span> {details.runtime} min</p>}
                {details.genres && <p className="text-gray-100"><span className="font-semibold text-blue-400">Genres:</span> {details.genres.map(g => g.name).join(", ")}</p>}
                {details.original_language && <p className="text-gray-100"><span className="font-semibold text-blue-400">Language:</span> {details.original_language.toUpperCase()}</p>}
              </div>
            </div>

            {/* أول 5 ممثلين */}
            {cast.length > 0 && (
              <div>
                <h2 className="text-xl md:text-2xl font-semibold mb-3">Cast</h2>
                <div className="flex gap-1
                 md:gap-4 overflow-x-auto py-2">
                  {cast.map(actor => (
                    <div key={actor.id} className="flex-shrink-0 w-20 md:w-24 text-center">
                      <img
                        className="w-20 h-28 md:w-24 md:h-32 object-cover rounded-lg mb-1"
                        src={
                          actor.profile_path
                            ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                            : "https://via.placeholder.com/200x300?text=No+Image"
                        }
                        alt={actor.name}
                      />
                      <p className="text-xs md:text-sm">{actor.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Similar Movies */}
      <SimilarMovies type={type} movieId={id} openTrailer={(key) => setTrailerKey(key)} />

      {/* نافذة التريلر */}
      {trailerKey && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-90 z-50">
          <div className="relative w-11/12 md:w-3/4 h-3/4">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="Trailer"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
            <button
              onClick={() => setTrailerKey(null)}
              className="absolute top-2 right-2 text-white text-3xl font-bold z-50"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
