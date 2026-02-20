import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PlusIcon, MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useSelector, useDispatch } from "react-redux";
import { setMenuCategories } from "@/state/menu/menuCategoriesSlice";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import AddCategoryForm from "@/components/CateroryComponents/AddCategoryForm";
import EditCategoryForm from "@/components/CateroryComponents/EditCategoryForm";
import SortableCategoryCard from "@/components/CateroryComponents/SortableCategoryCard"; // חדש

// DnD Kit imports
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import axiosInstance from "@/utils/baseUrl";
import CategoryCard from "@/components/CateroryComponents/CategoryCard";

export default function ManageCategories({
  isLoading,
  onCreate,
  onDelete,
  onEdit,
}) {
  const [showCreateForm, setShowCreateCategoryForm] = useState(false);
  const [creatingCategory, setCreatingCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const menuCategories = useSelector(
    (state) => state.menuCategories.menuCategories
  );

  // Sync categories with Redux state
  useEffect(() => {
    if (menuCategories && Array.isArray(menuCategories)) {
      setCategories(menuCategories);
    }
  }, [menuCategories]);

  // Filtered categories for search
  const filteredCategories = categories
    .filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.locationNumber - b.locationNumber);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Handle new category creation
  const handleSubmit = (data) => {
    onCreate(data);
    setShowCreateCategoryForm(false);
    setCreatingCategory(null);
  };

  // Handle edit
  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowEditForm(true);
  };

  // Handle drag and drop
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const oldIndex = categories.findIndex((cat) => cat._id === active.id);
    const newIndex = categories.findIndex((cat) => cat._id === over.id);

    const newCategories = arrayMove(categories, oldIndex, newIndex).map(
      (cat, idx) => ({
        ...cat,
        locationNumber: idx + 1,
      })
    );

    setCategories(newCategories);
    
    // Update Redux state
    dispatch(setMenuCategories(newCategories));

    // Update backend
    try {
      await axiosInstance.put(`/category/reorderCategories/${user._id}`, {
        categories: newCategories,
      });
      localStorage.setItem("categories", JSON.stringify(newCategories));
      console.log("successfully reordered categories");
    } catch (err) {
      console.error("Error reordering categories:", err);
    }
  };

  // Lock scroll when editing
  useEffect(() => {
    if (showEditForm) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
  }, [showEditForm]);

  // Delete handling
  const executeDelete = async () => {
    if (!categoryToDelete) return;

    try {
      const response = await axiosInstance.delete(
        `/category/deleteCategory/${user._id}/${categoryToDelete._id}`
      );
      
      const { deletedDishesCount } = response.data;
      
      // Update local state
      const newCategories = categories.filter(c => c._id !== categoryToDelete._id);
      setCategories(newCategories); 
      dispatch(setMenuCategories(newCategories)); // Sync Redux

      toast.success(`הקטגוריה נמחקה ו-${deletedDishesCount} מנות הוסרו בהצלחה`);
      
      setCategoryToDelete(null);
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("שגיאה במחיקת הקטגוריה");
    }
  };

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

        {/* Add Form */}
        <AnimatePresence>
          {showCreateForm && (
            <AddCategoryForm
              category={creatingCategory}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowCreateCategoryForm(false);
                setCreatingCategory(null);
              }}
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
          <SortableContext
            items={filteredCategories.map((c) => c._id)}
            strategy={rectSortingStrategy}
          >
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
                  onDelete: () => {}, // Disable delete during drag
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

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {categoryToDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setCategoryToDelete(null)}>
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
                      onClick={() => setCategoryToDelete(null)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                    >
                      ביטול
                    </button>
                    <button
                      onClick={executeDelete}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
                    >
                      כן, מחק הכל
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
