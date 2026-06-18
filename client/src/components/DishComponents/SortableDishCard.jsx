import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DishCard from "./DishCard";

export default function SortableDishCard({ id, ...props }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="h-full">
      <DishCard {...props} dragHandle={{ attributes, listeners }} />
    </div>
  );
}
