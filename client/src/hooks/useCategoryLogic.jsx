import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setMenuCategories } from "@/state/menu/menuCategoriesSlice";
import axiosInstance from "@/utils/baseUrl";
import { toast } from "react-toastify";

export const useCategoryLogic = (user, categories, setCategories) => {
  const dispatch = useDispatch();
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  
  const executeDelete = useCallback(async () => {
    if (!categoryToDelete) return;

    try {
      const response = await axiosInstance.delete(
        `/category/deleteCategory/${user._id}/${categoryToDelete._id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      );
      
      const { deletedDishesCount } = response.data;
      
      const newCategories = categories.filter(c => c._id !== categoryToDelete._id);
      setCategories(newCategories); 
      dispatch(setMenuCategories(newCategories));

      toast.success(`הקטגוריה נמחקה ו-${deletedDishesCount} מנות הוסרו בהצלחה`);
      setCategoryToDelete(null);
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("שגיאה במחיקת הקטגוריה");
    }
  }, [categoryToDelete, categories, user, dispatch, setCategories]);

  return {
    categoryToDelete,
    setCategoryToDelete,
    executeDelete
  };
};
