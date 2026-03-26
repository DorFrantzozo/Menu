import { useState, useEffect, useMemo, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Component imports
import AddCategoryForm from "@/components/CateroryComponents/AddCategoryForm";
import EditCategoryForm from "@/components/CateroryComponents/EditCategoryForm";
import SortableCategoryCard from "@/components/CateroryComponents/SortableCategoryCard";
import CategoryCard from "@/components/CateroryComponents/CategoryCard";
import CategoryDeleteModal from "@/components/CateroryComponents/CategoryDeleteModal";

// Custom Hooks for SRP
import { useCategoryLogic } from "@/hooks/useCategoryLogic";
import { useCategoryDnD } from "@/hooks/useCategoryDnD";

// DnD Kit imports
import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";

export default function ManageCategories({ isLoading, onCreate }) {
  const [showCreateForm, setShowCreateCategoryForm] = useState(false);
  const [creatingCategory, setCreatingCategory] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);

  // Redux state
  const user = useSelector((state) => state.user.user);
  const menuCategories = useSelector((state) => state.menuCategories.menuCategories);

  // Sync categories with Redux state
  useEffect(() => {
    if (menuCategories && Array.isArray(menuCategories)) {
      setCategories(menuCategories);
    }
  }, [menuCategories]);

  // SRP 1: Extracted API Logic
  const { categoryToDelete, setCategoryToDelete, executeDelete } = useCategoryLogic(
    user,
    categories,
    setCategories
  );

  // SRP 2: Extracted Drag & Drop mechanics
  const { sensors, activeId, handleDragStart, handleDragCancel, handleDragEnd } = useCategoryDnD(
    user,
    categories,
    setCategories
  );

  // Efficiency: useMemo prevents recalculating filters/sorts on unrelated renders
  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    return categories
      .filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => a.locationNumber - b.locationNumber);
  }, [categories, searchTerm]);

  // Efficiency: useCallback prevents props passing down causing child re-renders
  const handleSubmit = useCallback((data) => {
    onCreate(data);
    setShowCreateCategoryForm(false);
    setCreatingCategory(null);
  }, [onCreate]);

  const handleEditCategory = useCallback((category) => {
    setEditingCategory(category);
    setShowEditForm(true);
  }, []);

  const handleCancelCreate = useCallback(() => {
    setShowCreateCategoryForm(false);
    setCreatingCategory(null);
  }, []);

  // Lock scroll when editing
  useEffect(() => {
    if (showEditForm) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
  }, [showEditForm]);

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-48 bg-slate-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 dark:bg-none dark:bg-zinc-950 transition-colors duration-200 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-zinc-50">קטגוריות התפריט</h1>
            <p className="text-slate-600 dark:text-zinc-300 mt-2">ארגן את הפריטים שלך לפי קטגוריות</p>
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
              className="pl-10 bg-white dark:bg-zinc-800/80 dark:text-zinc-100 border-slate-200 dark:border-zinc-700 focus:border-amber-300 dark:placeholder:text-zinc-500 shadow-sm dark:shadow-none"
            />
          </div>
        </motion.div>

        {/* Add Form */}
        <AnimatePresence>
          {showCreateForm && (
            <AddCategoryForm
              category={creatingCategory}
              onSubmit={handleSubmit}
              onCancel={handleCancelCreate}
            />
          )}
        </AnimatePresence>

        {/* Categories Drag & Drop */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext items={filteredCategories.map((c) => c._id)} strategy={rectSortingStrategy}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredCategories.map((category) => (
                <SortableCategoryCard
                  key={category._id}
                  id={category._id}
                  user={user}
                  category={category}
                  onEdit={handleEditCategory}
                  onDelete={setCategoryToDelete}
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
            </motion.div>
          </SortableContext>

          <DragOverlay>
            {activeId ? (
              <CategoryCard
                category={categories.find((c) => c._id === activeId)}
                user={user}
                dragHandle={{
                  listeners: {},
                  attributes: {},
                  onDelete: () => {}, 
                  onEdit: () => {}
                }}
                onEdit={() => {}} 
                onDelete={() => {}} 
              />
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Empty State */}
        {filteredCategories.length === 0 && !isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <div className="text-slate-400 text-6xl mb-4">📂</div>
            <h3 className="text-xl font-semibold text-slate-600 dark:text-zinc-300 mb-2">לא נמצאה קטגוריה</h3>
            <p className="text-slate-500 dark:text-zinc-400">
              {searchTerm ? "נסה לחפש עם מונח אחר" : "הוסף קטגוריה חדשה כדי להתחיל"}
            </p>
          </motion.div>
        )}

        {/* SRP 3: Extracted UI Delete Confirmation Modal */}
        <CategoryDeleteModal 
          categoryToDelete={categoryToDelete}
          onCancel={() => setCategoryToDelete(null)}
          onConfirm={executeDelete}
        />
        
      </div>
    </div>
  );
}
