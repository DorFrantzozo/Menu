import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CategoryForm({ category, onSubmit, onCancel }) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (category) setName(category.name);
  }, [category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ id: category?.id, name: name.trim() });
    setName("");
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-white border border-slate-200 rounded-xl p-4 shadow-md space-y-4"
    >
      <Input 
        placeholder="Category name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white">
          {category ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}
