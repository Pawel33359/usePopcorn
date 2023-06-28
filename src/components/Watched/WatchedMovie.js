import React from "react";

export default function WatchedMovie({
  movie,
  onDeleteWatched,
  onSelectMovie,
}) {
  function handleDelete(e) {
    e.stopPropagation();
    onDeleteWatched(movie.imdbID);
  }

  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
      <button onClick={handleDelete} className="btn-delete">
        X
      </button>
    </li>
  );
}
