import { useState, useCallback } from "react";
import { useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useDispatch } from "react-redux";
import { addMenuDishesToCategory } from "@/state/menu/menuCategoriesSlice";
import axiosInstance from "@/utils/baseUrl";
import { toast } from "react-toastify";

export const useDishDnD = (user, categoryId, currentDishes) => {
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

    // שמירת המצב הקודם לצורך Rollback במקרה של שגיאה
    const previousDishes = [...currentDishes];

    const oldIndex = currentDishes.findIndex((dish) => dish._id === active.id);
    const newIndex = currentDishes.findIndex((dish) => dish._id === over.id);

    // חישוב המערך החדש עם המיקומים המעודכנים (Optimistic Update)
    const newDishes = arrayMove(currentDishes, oldIndex, newIndex).map(
      (dish, idx) => ({
        ...dish,
        locationNumber: idx + 1,
      })
    );

    // עדכון אופטימי מיידי ב-Redux וב-localStorage
    dispatch(addMenuDishesToCategory({ categoryId, dishes: newDishes }));

    try {
      // שליחת ה-Payload המצומצם בלבד לשרת (רק ID ומיקום חדש)
      const payload = newDishes.map((dish) => ({
        _id: dish._id,
        locationNumber: dish.locationNumber,
      }));

      await axiosInstance.put(
        `/dish/reorderDishes/${user._id}`,
        { dishes: payload },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
    } catch (err) {
      console.error("Error reordering dishes, rolling back:", err);
      toast.error("שגיאה בשינוי סדר המנות. המצב שוחזר.");
      
      // ביצוע Rollback למצב הקודם במקרה של כשל ב-API
      dispatch(addMenuDishesToCategory({ categoryId, dishes: previousDishes }));
    }
  }, [currentDishes, categoryId, user, dispatch]);

  return {
    sensors,
    activeId,
    handleDragStart,
    handleDragCancel,
    handleDragEnd,
  };
};
