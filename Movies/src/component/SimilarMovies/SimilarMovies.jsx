import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../../component/card/Card";

const API_KEY = "9f51d8297f25ad990d37941955830af6";
const BASE_URL = "https://api.themoviedb.org/3";

export default function SimilarMovies({ type, movieId, openTrailer }) {
  const [similar, setSimilar] = useState([]);

  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/${type}/${movieId}/similar?api_key=${API_KEY}&language=en-US&page=1`);
        setSimilar(res.data.results.slice(0, 10));
      } catch (err) {
        console.error(err);
      }
    };
    fetchSimilar();
  }, [type, movieId]);

  const getTrailer = async (id) => {
    try {
      const res = await axios.get(`${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}`);
      const trailer = res.data.results.find(v => v.type === "Trailer" && v.site === "YouTube");
      if (trailer) openTrailer(trailer.key);
      else alert("🚫 No trailer available");
    } catch (err) {
      console.error(err);
    }
  };

  if (similar.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-semibold mb-3">Similar Movies</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {similar.map(movie => (
          <Card key={movie.id} movie={movie} type={type} getTrailer={() => getTrailer(movie.id)} />
        ))}
      </div>
    </div>
  );
}
