import StarRating from "../StarRating";

export default function MovieRate({
  selectedId,
  setUserRating,
  userRating,
  handleRate,
  children,
}) {
  return (
    <>
      <StarRating
        maxRating={10}
        size={24}
        key={selectedId}
        onSetRating={setUserRating}
      />
      {userRating > 0 && (
        <button className="btn-add" onClick={handleRate}>
          Add to list
        </button>
      )}
      {children}
    </>
  );
}
