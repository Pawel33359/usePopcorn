import { useEffect, useRef, useState } from "react";
import Loader from "../Loader";
import ErrorMessage from "../ErrorMessage";
import { useKey } from "../../hooks/useKey";
import MovieRate from "./MovieRate";

export default function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatched,
  onChangeRating,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [isEdited, setIsEdited] = useState(false);

  // Counting how many times user clicked on stars for putting a rating
  const countRef = useRef(0);
  useEffect(() => {
    if (userRating) countRef.current++;
  }, [userRating]);

  // Checking if user already watched movie current movie and getting score he gave it
  const isWatched = [...watched].map((w) => w.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (w) => w.imdbID === selectedId
  )?.userRating;

  // Destructuring movie to get needed values
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  // Handling functions
  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      countRatingDecisions: countRef.current,
    };

    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }
  function handleEdited() {
    setIsEdited((e) => !e);
    setUserRating(0);
  }
  function handleChange() {
    onChangeRating(userRating);
    onCloseMovie();
  }

  // Custom hook. Movie will close on 'Escape'
  useKey("Escape", onCloseMovie);

  // Fetching Data
  useEffect(() => {
    async function getMovieDetails() {
      try {
        // Setting empty error and setting loading to true
        setError("");
        setIsLoading(true);
        // Fetching data from url
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=6f8f53cd&i=${selectedId}`
        );
        if (!res.ok)
          throw new Error("something went wrong with fetching movie");
        const data = await res.json();
        if (data.Response === "False") throw new Error("⛔Movie not found!");
        // Seting data in state
        setMovie(data);
      } catch (err) {
        // Showing error
        console.log(err.message);
        setError(err.message);
      } finally {
        // Stoping Loading
        setIsLoading(false);
      }
    }
    getMovieDetails();
  }, [selectedId]);

  // Changing title of the page
  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;
      return () => (document.title = "usePopcorn");
    },
    [title]
  );

  return (
    <div className="details">
      {isLoading && <Loader />}
      {error && <ErrorMessage message={error} />}
      {!isLoading && !error && (
        <>
          <header>
            <button
              className="btn-back"
              onClick={onCloseMovie}
              style={{ paddingBottom: "4px" }}
            >
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <MovieRate
                  selectedId={selectedId}
                  setUserRating={setUserRating}
                  userRating={userRating}
                  handleRate={handleAdd}
                />
              ) : (
                <>
                  <p>
                    You rated this movie {watchedUserRating} <span>⭐</span>.{" "}
                  </p>
                  {isEdited && (
                    <MovieRate
                      selectedId={selectedId}
                      setUserRating={setUserRating}
                      userRating={userRating}
                      handleRate={handleChange}
                    />
                  )}
                  <button className="btn-add" onClick={handleEdited}>
                    {!isEdited ? "Change rating" : "Return"}
                  </button>
                </>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring: {actors}</p>
            {director === "N/A" || <p>Directed by {director}</p>}
          </section>
        </>
      )}
    </div>
  );
}
