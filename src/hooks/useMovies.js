import { useEffect, useState } from "react";

export function useMovies(query /*,callback*/) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetching Data
  useEffect(() => {
    // callback?.();
    const controller = new AbortController();

    async function fetchMovies() {
      try {
        // Setting empty error and setting loading to true
        setError("");
        setIsLoading(true);

        // Fetching data from url
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=6f8f53cd&s=${query}`,
          { signal: controller.signal }
        );
        if (!res.ok)
          throw new Error("something went wrong with fetching movies");
        const data = await res.json();
        if (data.Response === "False") throw new Error("⛔Movie not found!");

        // Seting data in state that have posters
        setMovies(data.Search.filter((movie) => movie.Poster !== "N/A"));
      } catch (err) {
        // Showing error
        if (err.name !== "AbortError") {
          console.log(err.message);
          setError(err.message);
        }
      } finally {
        // Stoping Loading
        setIsLoading(false);
      }
    }

    // Returning before fetch if query shorter than 3 characters
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }
    fetchMovies();

    // aborting if new fetch send before old came back
    return () => {
      controller.abort();
    };
  }, [query]);

  return { movies, error, isLoading };
}
