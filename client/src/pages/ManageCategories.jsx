import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AddCategoryForm from "@/components/CateroryComponents/AddCategoryForm";
import EditCategoryForm from "@/components/CateroryComponents/EditCategoryForm";
import CategoryCard from "@/components/CateroryComponents/CategoryCard";

export default function ManageCategories({
  isLoading,
  onCreate,
  onDelete,
  onEdit,
}) {
  const [showCreateForm, setShowCreateCategoryForm] = useState(false);
  const [CreatingCategory, setCreatingCategory] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const categories = localStorage.getItem("categories")
    ? JSON.parse(localStorage.getItem("categories"))
    : [];

  const user = useSelector((state) => state.user.user);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (data) => {
    onCreate(data);
    setShowCreateCategoryForm(false);
    setCreatingCategory(null);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowEditForm(true);
  };

  if (showEditForm) {
    document.body.classList.add("overflow-hidden");
  } else {
    document.body.classList.remove("overflow-hidden");
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="h-48 bg-slate-200 rounded-xl"></div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 p-6 md:p-8"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              קטגוריות התפריט
            </h1>
            <p className="text-slate-600 mt-2">
              ארגן את הפריטים שלך לפי קטגוריות
            </p>
          </div>
          <Button
            onClick={() => setShowCreateCategoryForm(!showCreateForm)}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            הוסף קטגוריה
            <PlusIcon className="w-5 h-5 mr-2" />
          </Button>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="חפש קטגוריה ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-slate-200 focus:border-amber-300"
            />
          </div>
        </motion.div>

        {/* Form */}
        <AnimatePresence>
          {showCreateForm && (
            <AddCategoryForm
              category={CreatingCategory}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowCreateCategoryForm(false);
                setCreatingCategory(null);
              }}
            />
          )}
        </AnimatePresence>

        {/* Categories Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredCategories.map((category, index) => (
              <CategoryCard
                key={category._id}
                user={user}
                category={category}
                index={index}
                onEdit={handleEditCategory}
                onDelete={onDelete}
              />
            ))}
            {showEditForm && editingCategory && (
              <EditCategoryForm
                key={editingCategory._id || editingCategory.id}
                category={editingCategory}
                isOpen={showEditForm}
                setIsOpen={setShowEditForm}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredCategories.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-slate-400 text-6xl mb-4">📂</div>
            <h3 className="text-xl font-semibold text-slate-600 mb-2">
              לא נמצאה קטגוריה
            </h3>
            <p className="text-slate-500">
              {searchTerm
                ? "נסה לחפש עם מונח אחר"
                : "הוסף קטגוריה חדשה כדי להתחיל"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
