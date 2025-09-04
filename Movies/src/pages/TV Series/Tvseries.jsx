import React, { useState, useEffect } from "react";    
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Card from "../../component/card/Card";
import Loading from "../../component/Loading/Loading";
import AOS from "aos";
import "aos/dist/aos.css";

const API_KEY = "9f51d8297f25ad990d37941955830af6";
const BASE_URL = "https://api.themoviedb.org/3";

// قائمة التأثيرات المختلفة للكروت
const aosEffects = ["fade-up", "fade-down", "fade-left", "fade-right", "zoom-in"];

export default function TVSeries() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");
  const [page, setPage] = useState(1);
  const [trailerKey, setTrailerKey] = useState(null);

  // تهيئة AOS
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const { data: genres } = useQuery({
    queryKey: ["tvGenres"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/genre/tv/list?api_key=${API_KEY}&language=en-US`);
      return res.data.genres;
    },
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["tv", search, sortBy, year, genre, page],
    queryFn: async () => {
      const params = {
        api_key: API_KEY,
        language: "en-US",
        sort_by: sortBy,
        page,
        with_genres: genre || undefined,
        first_air_date_year: year || undefined,
      };

      const url = search ? `${BASE_URL}/search/tv` : `${BASE_URL}/discover/tv`;
      if (search) params.query = search;

      const res = await axios.get(url, { params });
      return { results: res.data.results, total_pages: res.data.total_pages };
    },
    keepPreviousData: true,
  });

  const getTrailer = async (tvId) => {
    try {
      const res = await axios.get(`${BASE_URL}/tv/${tvId}/videos?api_key=${API_KEY}`);
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
        <p className="text-red-500">❌ Error fetching TV series</p>
      </div>
    );

  return (
    <div className="p-6">
      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="flex-1" data-aos="fade-down">
          <input
            type="text"
            placeholder="Search TV series..."
            className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <div data-aos="fade-up" className="flex items-center gap-2 bg-gray-900 text-white shadow rounded-lg p-1.5">
            <label className="font-semibold text-blue-400">Sort By:</label>
            <select
              className="p-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
            >
              <option value="popularity.desc">Most Popular</option>
              <option value="vote_average.desc">Top Rated</option>
              <option value="first_air_date.desc">Newest</option>
            </select>
          </div>

          <div data-aos="fade-up" data-aos-delay="100" className="flex items-center gap-2 bg-gray-900 text-white shadow rounded-lg p-1.5">
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

          <div data-aos="fade-up" data-aos-delay="200" className="flex items-center gap-2 bg-gray-900 text-white shadow rounded-lg p-1.5">
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

          <button data-aos="fade-up" data-aos-delay="300"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            onClick={() => { setSearch(""); setSortBy("popularity.desc"); setYear(""); setGenre(""); setPage(1); }}
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[50vh]"><Loading /></div>
      ) : data?.results?.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {data.results.map((tv, index) => (
              <div
                key={tv.id}
                data-aos={aosEffects[index % aosEffects.length]}
                data-aos-delay={index * 100} // تأثير متدرج مثل Moves
              >
                <Card movie={tv} type="tv" getTrailer={getTrailer} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-3 mt-6" data-aos="fade-up">
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
        <p className="text-center text-gray-300 font-bold mt-10" data-aos="fade-up">No TV series found.</p>
      )}

      {/* Trailer Modal */}
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
