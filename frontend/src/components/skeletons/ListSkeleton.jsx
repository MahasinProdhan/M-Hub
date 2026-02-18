import CardSkeleton from "./CardSkeleton.jsx";

const ListSkeleton = ({
  count = 6,
  layout = "grid",
  cardVariant = "resource",
  columnsClass = "sm:grid-cols-2 lg:grid-cols-3",
  className = "",
}) => {
  const items = Array.from({ length: count });

  if (layout === "list") {
    return (
      <div className={`space-y-4 ${className}`}>
        {items.map((_, index) => (
          <CardSkeleton key={`list-skeleton-${index}`} variant="list" />
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 gap-6 ${columnsClass} ${className}`.trim()}>
      {items.map((_, index) => (
        <CardSkeleton key={`card-skeleton-${index}`} variant={cardVariant} />
      ))}
    </div>
  );
};

export default ListSkeleton;
