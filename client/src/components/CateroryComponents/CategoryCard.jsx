import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Modal from "../Modal";

export default function CategoryCard({ category, onEdit, onDelete, user }) {
  const [showDeleteForm, setShowDeleteForm] = useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
      {/* תמונה עם שכבת כיסוי למוסתר */}
      <div className="relative h-40 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
        {category.img ? (
          <>
            <img
              src={category.img}
              alt={category.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
            {category.hide && (
              <div className="absolute inset-0 bg-black bg-opacity-70 z-10 flex items-center justify-center">
                <span className="text-white font-bold text-lg">מוסתר</span>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400 text-4xl select-none">
            🖼️
          </div>
        )}
      </div>

      {/* תוכן הכרטיס */}
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
          <p className="text-xs text-slate-400">ID: {category._id}</p>
        </div>

        {/* כפתורים */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => onEdit(category)}
            className="flex items-center gap-1 text-amber-600 hover:text-amber-700 transition-colors duration-200"
            aria-label="Edit category"
          >
            <PencilIcon className="w-5 h-5" />
            <span className="hidden sm:inline">ערוך</span>
          </button>
          <button
            onClick={() => setShowDeleteForm(true)}
            className="flex items-center gap-1 text-red-500 hover:text-red-600 transition-colors duration-200"
            aria-label="Delete category"
          >
            <TrashIcon className="w-5 h-5" />
            <span className="hidden sm:inline">מחק</span>
          </button>

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
      </div>
    </div>
  );
}
