import React, { useEffect, useState } from "react"; 
import { useLocation } from "react-router-dom";
import axios from "axios";
import Card from "../../component/card/Card";
import Loading from "../../component/Loading/Loading";

const API_KEY = "9f51d8297f25ad990d37941955830af6";
const BASE_URL = "https://api.themoviedb.org/3";

export default function Search({ getTrailer = () => {} }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trending, setTrending] = useState([]);
  const location = useLocation();

  const query = new URLSearchParams(location.search).get("query") || "";

  // جلب نتائج البحث
  useEffect(() => {
    async function fetchSearch() {
      if (!query) {
        setResults([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [moviesRes, tvRes] = await Promise.all([
          axios.get(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`),
          axios.get(`${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}`)
        ]);

        const movies = moviesRes.data.results.map(item => ({ ...item, type: "movie" }));
        const tvs = tvRes.data.results.map(item => ({ ...item, type: "tv" }));

        const allResults = [...movies, ...tvs].filter(item => item.title || item.name);
        setResults(allResults);
      } catch (err) {
        console.error(err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSearch();
  }, [query]);

  // جلب اقتراحات Trending Movies
  useEffect(() => {
    async function fetchTrending() {
      try {
        const res = await axios.get(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}`);
        setTrending(res.data.results.slice(0, 8)); // نعرض 8 فقط
      } catch (err) {
        console.error(err);
      }
    }
    fetchTrending();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[100vh]">
        <Loading />
      </div>
    );

  // لو مفيش نتائج البحث
  if (!results.length)
    return (
      <div className="p-6 min-h-[100vh]">
        <div className="text-center p-10 font-bold text-red-500 text-lg">
          🚫 No results found for "{query}"
        </div>
        {trending.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mb-4 mt-6 text-blue-400 text-center">
              Trending Movies You May Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {trending.map(movie => (
                <Card key={movie.id} movie={{...movie, type: "movie"}} type="movie" getTrailer={getTrailer} />
              ))}
            </div>
          </>
        )}
      </div>
    );

  // لو فيه نتائج
  return (
    <div className="p-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {results.map(item => (
        <Card
          key={`${item.id}-${item.type}`}
          movie={item}
          type={item.type}
          getTrailer={getTrailer}
        />
      ))}
    </div>
  );
}
