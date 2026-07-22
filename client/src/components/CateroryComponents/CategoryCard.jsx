import {
  PencilIcon,
  TrashIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

export default function CategoryCard({
  category,
  onEdit,
  onDelete,
  user,
  dragHandle,
}) {
  const menuCategories = useSelector((state) => state.menuCategories.menuCategories);
  const isSubCategory = user?.enableSubCategories && category.parentCategory;
  const parentCategoryObj = isSubCategory 
    ? menuCategories?.find((cat) => cat._id === category.parentCategory) 
    : null;

  return (
    <div className="relative bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700/80 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
      {/* Drag handle – שלוש נקודות */}
      <button
        className="absolute top-2 left-2 cursor-grab rounded-t-lg rounded-b-lg py-1   bg-white/90 shadow-md  z-10"
        {...dragHandle.listeners}
        {...dragHandle.attributes}
        aria-label="גרור לשינוי מיקום"
      >
        <EllipsisHorizontalIcon className="w-6 h-6 rotate-90 text-black dark:text-zinc-50" />
      </button>

      {/* תמונה */}
      <div className="relative h-40 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
        {category.img ? (
          <img
            src={category.img}
            alt={category.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400 text-4xl select-none">
            🖼️
          </div>
        )}

        {category.hide && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center text-white text-lg font-bold">
            מוסתר
          </div>
        )}

        {/* Feature Flag: Sub-category Badge */}
        {isSubCategory && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded shadow-sm z-10 flex items-center gap-1">
            <span>🏷️</span> תת-קטגוריה של {parentCategoryObj ? parentCategoryObj.name : "לא ידוע"}
          </div>
        )}
      </div>

      {/* תוכן */}
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-50 mb-1 hover:text-amber-600 transition-colors duration-200">
            {category.name}
          </h3>
          {category.description && (
            <p className="text-sm text-slate-600 dark:text-zinc-300 mb-2">
              {category.description}
            </p>
          )}
          <p className="text-xs text-slate-400 dark:text-zinc-400">
            מיקום: {category.locationNumber}
          </p>
        </div>

      {/* כפתורים */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => onEdit(category)}
            className="flex items-center gap-1 text-amber-600 hover:text-amber-700 transition-colors duration-200"
          >
            <PencilIcon className="w-5 h-5" />
            <span className="hidden sm:inline">ערוך</span>
          </button>
          <button
            onClick={() => onDelete(category)}
            className="flex items-center gap-1 text-red-500 hover:text-red-600 transition-colors duration-200"
          >
            <TrashIcon className="w-5 h-5" />
            <span className="hidden sm:inline">מחק</span>
          </button>
        </div>
      </div>
    </div>
  );
}

CategoryCard.propTypes = {
  category: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    locationNumber: PropTypes.number.isRequired,
    img: PropTypes.string,
    hide: PropTypes.bool,
    parentCategory: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  user: PropTypes.object,
  dragHandle: PropTypes.shape({
    listeners: PropTypes.object.isRequired,
    attributes: PropTypes.object.isRequired,
  }),
};
