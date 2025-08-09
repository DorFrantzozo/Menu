export default function CategoryFilters({ activeFilter, setActiveFilter }) {
  const filters = ["הכל", "starters", "main", "dessert"];

  return (
    <div className="flex gap-2 flex-wrap">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => setActiveFilter(filter)}
          className={`px-4 py-1 rounded-full border text-sm transition ${
            activeFilter === filter
              ? "bg-amber-500 text-white"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
          }`}
        >
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
        </button>
      ))}
    </div>
  );
}
