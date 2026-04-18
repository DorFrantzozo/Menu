import React, { useState } from "react";
import { TrashIcon, PlusIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

const ReviewTable = ({ data, setData, user }) => {
  const [newCategory, setNewCategory] = useState("");

  const handleImageUpload = (index, file) => {
    if (!file) return;
    
    // Revoke old blob URL if exists to free memory
    if (data[index].imageUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(data[index].imageUrl);
    }

    // Create local preview URL
    const localUrl = URL.createObjectURL(file);
    
    // Update data state with both preview URL and raw file
    const updatedData = [...data];
    updatedData[index] = {
      ...updatedData[index],
      imageUrl: localUrl,
      rawFile: file
    };
    setData(updatedData);
  };

  const handleDishChange = (index, field, value) => {
    const updatedData = [...data];
    updatedData[index][field] = value;
    setData(updatedData);
  };

  const removeDish = (index) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק מנה זו?")) {
      // Cleanup blob URL if it exists
      if (data[index].imageUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(data[index].imageUrl);
      }
      const updatedData = data.filter((_, i) => i !== index);
      setData(updatedData);
    }
  };

  const addDish = () => {
    setData([
      ...data,
      { name: "", description: "", price: "", category: newCategory || "כללי" }
    ]);
  };

  return (
    <div className="w-full flex flex-col items-end" dir="rtl">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">סקירת מנות</h3>
        <p className="text-sm text-gray-500 dark:text-zinc-400">
          בדוק את המידע שנסרק וערוך כנדרש לפני השמירה.
        </p>
      </div>

      <div className="w-full relative">
        {/* Mobile Scroll Hint - hidden on desktop */}
        <div className="md:hidden mb-2 flex items-center justify-start space-x-1 text-[10px] text-gray-400 dark:text-zinc-500 animate-pulse">
           <span>← החלק לצדדים כדי לראות את כל העמודות</span>
        </div>
        
        <div className="w-full overflow-x-auto shadow-sm ring-1 ring-gray-300 dark:ring-zinc-700 sm:rounded-lg custom-scrollbar">
          <table className="min-w-full divide-y divide-gray-300 dark:divide-zinc-700 table-fixed sm:table-auto">
          <thead className="bg-gray-50 dark:bg-zinc-800/50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-right text-sm font-semibold text-gray-900 dark:text-zinc-200">
                קטגוריה
              </th>
              <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 dark:text-zinc-200 w-56">
                שם מנה
              </th>
              <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 dark:text-zinc-200">
                תיאור מנה
              </th>
              <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 dark:text-zinc-200 w-28">
                מחיר (₪)
              </th>
              <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 dark:text-zinc-200 w-28">
                תמונה
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">פעולות</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-zinc-700 bg-white dark:bg-zinc-900">
            {data.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm w-40">
                  <input
                    type="text"
                    value={item.category || ""}
                    onChange={(e) => handleDishChange(idx, "category", e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 dark:bg-zinc-800/80"
                    placeholder="כללי"
                  />
                </td>
                <td className="whitespace-nowrap px-3 py-2 text-sm w-56">
                  <input
                    type="text"
                    value={item.name || ""}
                    onChange={(e) => handleDishChange(idx, "name", e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 dark:bg-zinc-800/80"
                    placeholder="שם המנה"
                  />
                </td>
                <td className="px-3 py-2 text-sm min-w-[300px]">
                  <textarea
                    value={item.description || ""}
                    onChange={(e) => handleDishChange(idx, "description", e.target.value)}
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 dark:bg-zinc-800/80"
                    placeholder="תיאור מנה (אופציונלי)"
                  />
                </td>
                <td className="whitespace-nowrap px-3 py-2 text-sm w-28 text-center">
                  <input
                    type="number"
                    value={item.price || ""}
                    onChange={(e) => handleDishChange(idx, "price", e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 dark:bg-zinc-800/80 text-center"
                    placeholder="0"
                    min="0"
                  />
                </td>
                <td className="whitespace-nowrap px-3 py-2 text-sm w-28 text-center">
                  {item.imageUrl ? (
                    <div className="relative w-12 h-12 mx-auto">
                      <img src={item.imageUrl} alt="dish" className="w-12 h-12 object-cover rounded-md shadow-sm" />
                      <label className="absolute -bottom-1 -right-1 bg-white dark:bg-zinc-800 rounded-full p-0.5 cursor-pointer shadow-sm border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700">
                        <PhotoIcon className="w-3 h-3 text-blue-500" />
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(idx, e.target.files[0])} />
                      </label>
                    </div>
                  ) : (
                    <label className="cursor-pointer w-12 h-12 mx-auto rounded-md border-2 border-dashed border-gray-300 dark:border-zinc-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-zinc-800 hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                      <PhotoIcon className="w-5 h-5 text-gray-400 dark:text-zinc-500" />
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(idx, e.target.files[0])} />
                    </label>
                  )}
                </td>
                <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-left text-sm font-medium sm:pr-6">
                  <button
                    onClick={() => removeDish(idx)}
                    className="text-red-500 hover:text-red-700 transition-colors p-1"
                    title="מחק מנה"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {data.length === 0 && (
          <div className="text-center py-6 text-gray-500 dark:text-zinc-400">
            לא נמצאו מנות. הוסף ידנית.
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between w-full">
        <button
          type="button"
          onClick={addDish}
          className="flex items-center space-x-2 rtl:space-x-reverse text-sm font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          <span>הוסף מנה ידנית</span>
        </button>
      </div>
    </div>
    </div>
  );
};

export default ReviewTable;
