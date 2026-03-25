import { AnimatePresence, motion } from "framer-motion";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function CategoryDeleteModal({ categoryToDelete, onCancel, onConfirm }) {
  if (!categoryToDelete) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" 
        onClick={onCancel}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
        >
          <div className="p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <TrashIcon className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">אתה בטוח?</h3>
            <p className="text-gray-500 mb-6">
              פעולה זו תמחק לצמיתות את הקטגוריה <strong>"{categoryToDelete.name}"</strong> ואת כל המנות שבתוכה. לא ניתן לבטל פעולה זו.
            </p>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
              >
                ביטול
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
              >
                כן, מחק הכל
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
