import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CategoryCard from "./CategoryCard";

export default function SortableCategoryCard({ id, ...props }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <CategoryCard {...props} dragHandle={{ attributes, listeners }} />
    </div>
  );
}
