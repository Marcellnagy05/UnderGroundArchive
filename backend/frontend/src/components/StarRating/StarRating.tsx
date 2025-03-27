const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="rating">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = rating >= star;
          const isHalfFilled = rating >= star - 0.5 && rating < star;
          return (
            <span
              key={star}
              className={`star ${isFilled ? "filled" : isHalfFilled ? "half-filled" : ""}`}
            >
              ★
            </span>
          );
        })}
      </div>
    );
  };

  export default StarRating;