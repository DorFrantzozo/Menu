import React from "react";
import ActionCard from "./ActionCard";
import {
  PlusIcon,
  FolderIcon,
  CogIcon,
  PaintBrushIcon,
  WrenchIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const QuickActionsCards = () => {
  const navigate = useNavigate();

  return (
    <div
      className="border   rounded-lg p-6 w-full max-w-4xl  mb-10 shadow-lg bg-white"
      dir="rtl"
    >
      <h1 className="flex items-center gap-4 text-xl font-semibold text-slate-800 mb-6">
        <WrenchIcon className="w-10 h-10 bg-zinc-200 shadow-lg border p-2 rounded text-black" />
        פעולות מהירות
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <ActionCard
          name={"הוסף מנה חדשה"}
          onclick={() => navigate("/manage-dishes")}
          bg={"bg-gradient-to-r from-sky-300 via-sky-400 to-sky-500"}
          description={"הוסף מנות חדשות לתפריט"}
          actionName={"הוסף מנה חדשה"}
          icon={<PlusIcon className="w-6 h-6" />}
        />
        <ActionCard
          name={"נהל קטגוריות"}
          onclick={() => navigate("/manage-categories")}
          description={"נהל וסדר את קטגוריות התפריט"}
          actionName={"נהל את הקטגוריות"}
          bg={"bg-gradient-to-r from-emerald-400 via-emerald-600 to-green-600"}
          icon={<FolderIcon className="w-6 h-6" />}
        />
        <ActionCard
          name={"הגדרות מסעדה"}
          description={"עדכן את המידע אודות המסעדה"}
          actionName={"הגדרות"}
          onclick={() => navigate("/profile")}
          bg={"bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600"}
          icon={<CogIcon className="w-6 h-6" />}
        />
        <ActionCard
          name={"בחר עיצוב"}
          onclick={() => navigate("/designs")}
          bg={"bg-gradient-to-r from-violet-400 via-violet-500 to-violet-700"}
          description={"בחר ממגון עיצובים"}
          actionName={"שנה עיצוב"}
          icon={<PaintBrushIcon className="w-6 h-6" />}
        />
      </div>
    </div>
  );
};

export default QuickActionsCards;
