import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Modal from "../Modal";
import EditDishForm from "./EditDishForm";

export default function DishCard({ dish, user }) {
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700/80 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
      {/* תמונה עם שכבת "מוסתר" במידת הצורך */}
      <div className="relative h-40 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
        {dish.img ? (
          <>
            <img
              src={dish.img}
              alt={dish.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
            {dish.hide && (
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
          <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-50 mb-1 hover:text-sky-600 dark:hover:text-sky-400 transition-colors duration-200">
            {dish.name}
          </h3>
          {dish.description && (
            <p className="text-sm text-slate-600 dark:text-zinc-300 mb-2">{dish.description}</p>
          )}
       <div className="flex items-center gap-2 mb-2">
      {dish.salePrice && Number(dish.salePrice) > 0 && Number(dish.salePrice) !== dish.price ? (
        <>
          <p className="text-lg text-emerald-600 font-bold">₪{dish.salePrice}</p>
          <p className="text-sm text-red-500 line-through decoration-red-500 opacity-70">₪{dish.price}</p>
        </>
      ) : (
        <p className="text-lg text-slate-700 dark:text-zinc-200 font-bold">₪{dish.price}</p>
      )}
    </div>
          <div className="flex flex-wrap gap-2 mt-2 text-xs text-slate-500 dark:text-zinc-400">
            {dish.vegi && <span>🌱 צמחוני/טבעוני</span>}
            {dish.pregnant && <span>🤰 מתאים להריוניות</span>}
            {dish.lactose && <span>🥛 ללא לקטוז</span>}
            {dish.gluten && <span>🌾 ללא גלוטן</span>}
          </div>
        </div>

        {/* כפתורים */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setShowEditForm(!showEditForm)}
            className="flex items-center gap-1 text-amber-600 hover:text-amber-700 transition-colors duration-200"
            aria-label="Edit dish"
          >
            <PencilIcon className="w-5 h-5" />
            <span className="hidden sm:inline">ערוך</span>
          </button>
          <button
            onClick={() => setShowDeleteForm(true)}
            className="flex items-center gap-1 text-red-500 hover:text-red-600 transition-colors duration-200"
            aria-label="Delete dish"
          >
            <TrashIcon className="w-5 h-5" />
            <span className="hidden sm:inline">מחק</span>
          </button>

          {showEditForm && (
            <EditDishForm dish={dish} setShowEditForm={setShowEditForm} />
          )}
          {showDeleteForm && (
            <Modal
              open={showDeleteForm}
              setOpen={setShowDeleteForm}
              user={user}
              item={dish}
              type={"dish"}
            />
          )}
        </div>
      </div>
    </div>
  );
}
