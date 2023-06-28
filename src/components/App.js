// HOOKS
import { useState } from "react";
import { useMovies } from "../hooks/useMovies";
import { useLocalStorageState } from "../hooks/useLocalStorageState";
// COMPONENTS
import Navbar from "./Navbar/Navbar";
import Search from "./Search";
import NumResults from "./NumResults";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import Main from "./Main";
import Box from "./Box";
import MovieList from "./Movie/MovieList";
import MovieDetails from "./Movie/MovieDetails";
import WatchedSummary from "./Watched/WatchedSummary";
import WatchedMoviesList from "./Watched/WatchedMovieList";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  //Custom hooks
  const { movies, error, isLoading } = useMovies(query);
  const [watched, setWatched] = useLocalStorageState([], "watched");

  // Handle events functions
  function handleSelectMovie(id) {
    setSelectedId((selId) => (id === selId ? null : id));
  }
  function handleCloseMovie() {
    setSelectedId(null);
  }
  function handleAddWatched(movie) {
    setWatched((w) => [...w, movie]);
  }
  function handleDeleteWatched(id) {
    setWatched((w) => w.filter((movie) => movie.imdbID !== id));
  }
  function handleChangeRating(newRating) {
    setWatched((w) =>
      w.map((movie) =>
        movie.imdbID !== selectedId
          ? movie
          : { ...movie, userRating: newRating }
      )
    );
  }

  return (
    <>
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Navbar>
      <Main>
        <Box>
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {isLoading && <Loader />}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              onChangeRating={handleChangeRating}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
                onSelectMovie={handleSelectMovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
