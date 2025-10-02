import {
  PencilIcon,
  TrashIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import Modal from "../Modal";
import PropTypes from "prop-types";
export default function CategoryCard({
  category,
  onEdit,
  // onDelete,
  user,
  dragHandle,
}) {
  const [showDeleteForm, setShowDeleteForm] = useState(false);

  return (
    <div className="relative bg-white border border-slate-200 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
      {/* Drag handle – שלוש נקודות */}
      <button
        className="absolute top-2 left-2 cursor-grab rounded-t-lg rounded-b-lg py-1   bg-white/90 shadow-md  z-10"
        {...dragHandle.listeners}
        {...dragHandle.attributes}
        aria-label="גרור לשינוי מיקום"
      >
        <EllipsisHorizontalIcon className="w-6 h-6 rotate-90 text-black" />
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
          <div className="absolute inset-0  bg-black bg-opacity-70 flex items-center justify-center text-white text-lg font-bold">
            מוסתר
          </div>
        )}
      </div>

      {/* תוכן */}
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-1 hover:text-amber-600 transition-colors duration-200">
            {category.name}
          </h3>
          {category.description && (
            <p className="text-sm text-slate-600 mb-2">
              {category.description}
            </p>
          )}
          <p className="text-xs text-slate-400">
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
            onClick={() => setShowDeleteForm(true)}
            className="flex items-center gap-1 text-red-500 hover:text-red-600 transition-colors duration-200"
          >
            <TrashIcon className="w-5 h-5" />
            <span className="hidden sm:inline">מחק</span>
          </button>
        </div>
      </div>

      {showDeleteForm && (
        <Modal
          open={showDeleteForm}
          setOpen={setShowDeleteForm}
          user={user}
          item={category}
          type={false}
        />
      )}
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
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  user: PropTypes.object,
  dragHandle: PropTypes.shape({
    listeners: PropTypes.object.isRequired,
    attributes: PropTypes.object.isRequired,
  }),
};
