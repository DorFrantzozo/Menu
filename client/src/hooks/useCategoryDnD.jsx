import { useState, useCallback } from "react";
import { useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useDispatch } from "react-redux";
import { setMenuCategories } from "@/state/menu/menuCategoriesSlice";
import axiosInstance from "@/utils/baseUrl";

export const useCategoryDnD = (user, categories, setCategories) => {
  const [activeId, setActiveId] = useState(null);
  const dispatch = useDispatch();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = useCallback((event) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  const handleDragEnd = useCallback(async (event) => {
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
    dispatch(setMenuCategories(newCategories));

    try {
      await axiosInstance.put(`/category/reorderCategories/${user._id}`, {
        categories: newCategories,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      localStorage.setItem("categories", JSON.stringify(newCategories));
    } catch (err) {
      console.error("Error reordering categories:", err);
    }
  }, [categories, user, dispatch, setCategories]);

  return {
    sensors,
    activeId,
    handleDragStart,
    handleDragCancel,
    handleDragEnd,
  };
};
