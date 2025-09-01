import React, { useState } from "react"; 
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Card from "../../component/card/Card";
import Loading from "../../component/Loading/Loading";

const API_KEY = "9f51d8297f25ad990d37941955830af6";
const BASE_URL = "https://api.themoviedb.org/3";

export default function Movies() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");
  const [page, setPage] = useState(1);
  const [trailerKey, setTrailerKey] = useState(null); // مودال التريلر

  // جلب أنواع الأفلام
  const { data: genres } = useQuery({
    queryKey: ["genres"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`);
      return res.data.genres;
    },
  });

  // جلب الأفلام
  const { data, isLoading, isError } = useQuery({
    queryKey: ["movies", search, sortBy, year, genre, page],
    queryFn: async () => {
      const params = {
        api_key: API_KEY,
        language: "en-US",
        sort_by: sortBy,
        page,
        with_genres: genre || undefined,
        primary_release_year: year || undefined,
      };
      const url = search ? `${BASE_URL}/search/movie` : `${BASE_URL}/discover/movie`;
      if (search) params.query = search;
      const res = await axios.get(url, { params });
      return { results: res.data.results, total_pages: res.data.total_pages };
    },
    keepPreviousData: true,
  });

  // دالة فتح المودال
  const getTrailer = async (movieId) => {
    try {
      const res = await axios.get(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`);
      const trailer = res.data.results.find(v => v.type === "Trailer" && v.site === "YouTube");
      if (trailer) setTrailerKey(trailer.key);
      else alert("🚫 No trailer available");
    } catch (err) {
      console.error(err);
    }
  };

  if (isError)
    return (
      <div className="flex justify-center items-center min-h-[100vh]">
        <p className="text-red-500">❌ Error fetching movies</p>
      </div>
    );

  return (
    <div className="p-6">
      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search movies..."
            className="w-full p-3  rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          {/* Sort */}
          <div className="flex items-center gap-2 bg-gray-900 text-white shadow rounded-lg p-1.5">
            <label className="font-semibold text-blue-400">Sort By:</label>
            <select
              className="p-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
            >
              <option value="popularity.desc">Most Popular</option>
              <option value="vote_average.desc">Top Rated</option>
              <option value="release_date.desc">Newest</option>
            </select>
          </div>

          {/* Year */}
          <div className="flex items-center gap-2 bg-gray-900 text-white shadow rounded-lg p-1.5">
            <label className="font-semibold text-blue-400">Year:</label>
            <select
              className="p-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={year}
              onChange={(e) => { setYear(e.target.value); setPage(1); }}
            >
              <option value="">All</option>
              {Array.from({ length: new Date().getFullYear() - 1900 + 1 }, (_, i) => 1900 + i).reverse().map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Genre */}
          <div className="flex items-center gap-2 bg-gray-900 text-white shadow rounded-lg p-1.5">
            <label className="font-semibold text-blue-400">Genre:</label>
            <select
              className="p-2 rounded-md min-w-[120px] bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={genre}
              onChange={(e) => { setGenre(e.target.value); setPage(1); }}
            >
              <option value="">All</option>
              {genres?.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            onClick={() => { setSearch(""); setSortBy("popularity.desc"); setYear(""); setGenre(""); setPage(1); }}
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Movies Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[50vh]"><Loading /></div>
      ) : data?.results?.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {data.results.map((movie) => (
              <Card key={movie.id} movie={movie} type="movie" getTrailer={getTrailer} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-3 mt-6">
            <button
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50"
              disabled={page === 1}
              onClick={() => setPage(prev => prev - 1)}
            >
              Prev
            </button>
            <span className="text-white">{page}</span>
            <button
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50"
              disabled={page === data.total_pages}
              onClick={() => setPage(prev => prev + 1)}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-300 font-bold mt-10">No movies found.</p>
      )}

      {/* Trailer Modal */}
      {trailerKey && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-90 z-50">
          <div className="relative w-11/12 md:w-3/4 h-3/4 bg-black rounded-lg overflow-hidden">
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
