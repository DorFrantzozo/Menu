import React from "react";
import DashboardCard from "./DashboardCard";
import { TagIcon } from "@heroicons/react/24/outline";
import { CubeIcon, FireIcon } from "@heroicons/react/24/solid";

const DashboardDataCards = ({ menuCategories, allActiveItems, allItems }) => {
  return (
    <div dir="rtl" className="  lg:flex gap-10 justify-center w-full p-8">
      {" "}
      <DashboardCard
        array={menuCategories}
        name="קטגוריות"
        icon={<TagIcon />}
        bgColor="bg-white"
        iconColor="text-blue-600"
      />
      <DashboardCard
        array={allActiveItems}
        name="מנות פעילות"
        icon={<FireIcon />}
        bgColor=""
        iconColor="text-green-600"
      />
      <DashboardCard
        array={allItems}
        name="סך הכל פריטים"
        icon={<CubeIcon />}
        bgColor=""
        iconColor="text-orange-600"
      />
    </div>
  );
};

export default DashboardDataCards;
