import { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import DishFilters from "@/components/DishComponents/DishFilters";
import DishList from "@/components/DishComponents/DishList";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@headlessui/react";
import AddDishForm from "@/components/DishComponents/AddDishForm";
import EditDishForm from "@/components/DishComponents/EditDishForm";

export default function ManageDish() {
  const menuCategories = useSelector((state) => state.menuCategories.menuCategories || []);
  const location = useLocation();
  const { item } = location.state || {};
  const title = item?.name || "ניהול מנות";
  const user = useSelector((state) => state.user.user);
  const currentCategory = menuCategories.find(cat => cat._id === item?._id);
  const allDishes = currentCategory
    ? currentCategory.menuDishes || []
    : menuCategories.flatMap(cat => cat.menuDishes || []);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState(currentCategory?._id || "");
  const [filterSensitivity, setFilterSensitivity] = useState("");
  const [showDishForm, setShowCreateDishForm] = useState(false);
  
  const filteredDishes = allDishes.filter((dish) => {
    if (!dish.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (filterCategory && dish.category !== filterCategory) return false;

    if (filterSensitivity) {
      if (filterSensitivity === "pregnant" && !dish.pregnant) return false;
      if (filterSensitivity === "gluten" && !dish.gluten) return false;
      if (filterSensitivity === "lactose" && !dish.lactose) return false;
      if (filterSensitivity === "vegi" && !dish.vegi) return false;
    }

    return true;
  });

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
       
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">מנות התפריט</h1>
            <p className="text-slate-600 mt-2">ערוך את מנות המסעדה</p>
          </div>
          <Button
            onClick={() => setShowCreateDishForm(!showDishForm)}
            className="bg-gradient-to-r from-sky-300 via-sky-400 to-sky-500 rounded w-auto p-2 flex  hover:from-sky-500 hover:to-sky-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
           
            הוסף מנה 
            <PlusIcon className="w-5 h-5 mr-2" />
          </Button>
        </motion.div>
        {showDishForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <AddDishForm closeModal={()=> setShowCreateDishForm(false)}  />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
   

          
          <DishFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            categories={menuCategories}
            filterSensitivity={filterSensitivity}
            setFilterSensitivity={setFilterSensitivity}
          />
        </motion.div>

       
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <AnimatePresence>
            <DishList user={user} dishes={filteredDishes} />
          </AnimatePresence>
        </motion.div>
        
        {/* מצב ריק */}
        {filteredDishes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-slate-400 text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-slate-600 mb-2">לא נמצאו מנות</h3>
            <p className="text-slate-500">
              {searchTerm || filterCategory || filterSensitivity
                ? "נסה לחפש עם מונח אחר או הסר פילטרים"
                : "הוסף מנות לתפריט כדי להתחיל"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
