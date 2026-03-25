import React from "react";
import DefaultButton from "../buttons/DefaultButton";
import { QrCodeIcon } from "@heroicons/react/24/outline";

const DashboardTitle = ({ user }) => {
  return (
    <div
      className="flex flex-col md:flex-row md:items-center md:justify-between ms-[10%] me-[10%] mb-10 gap-4"
      dir="rtl"
    >
      <div>
        <h1 className="text-2xl lg:text-3xl mb-4">
          ברוך הבא מסעדת - {user.displayName} 👋
        </h1>
        <p className="text-lg">
          כאן תוכל לנהל את התפריט שלך, להוסיף מנות, קטגוריות ולצפות בסטטיסטיקות.
        </p>
      </div>

      <DefaultButton
        onClick={() =>
          window.open(
            `https://${user?.restaurantName.toLowerCase()}.imenu-il.online/menu`,
            "_blank"
          )
        }
        hover="hover:scale-110"
        hoverTextColor="hover:text-white"
        className="flex items-center w-48 gap-2 bg-gradient-to-r from-blue-400 to-cyan-500 text-xl"
        icon={<QrCodeIcon className="w-6 h-6" />}
        text="לצפייה בתפריט"
      />
    </div>
  );
};

export default DashboardTitle;
