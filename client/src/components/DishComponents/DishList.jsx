import { useState } from "react";
import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { useDishDnD } from "@/hooks/useDishDnD";
import SortableDishCard from "./SortableDishCard";
import DishCard from "./DishCard";

export default function DishList({ dishes, user, categoryId, isSortable }) {
  // SRP: ניהול גרירה רק אם המצב מאפשר מיון
  const { sensors, activeId, handleDragStart, handleDragCancel, handleDragEnd } =
    useDishDnD(user, categoryId, dishes);

  if (isSortable && dishes.length > 0) {
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext items={dishes.map((d) => d._id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {dishes.map((dish) => (
              <SortableDishCard
                key={dish._id}
                id={dish._id}
                user={user}
                dish={dish}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeId ? (
            <DishCard
              dish={dishes.find((d) => d._id === activeId)}
              user={user}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {dishes.length > 0 ? (
        dishes.map((dish) => <DishCard key={dish._id} user={user} dish={dish} />)
      ) : (
        <p className="col-span-full text-center text-gray-500">לא נמצאו מנות התואמות לסינון</p>
      )}
    </div>
  );
}
