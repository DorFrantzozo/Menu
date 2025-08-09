import React from 'react';

const ActionCard = ({ name, actionName, icon, onclick, bg, description }) => {
  return (
    <div className="w-full group  transition-transform duration-300">
      <div className="bg-slate-100 p-4 rounded-xl hover:shadow-xl transition duration-300 flex flex-col justify-between h-full">
        {/* אייקון וכותרת */}
        <div className="flex items-center gap-4 mb-2">
          <div
            className={`w-10 h-10 flex items-center justify-center rounded ${bg} text-white group-hover:scale-110 transition-transform duration-300 `}
          >
            {icon}
          </div>
          <h3 className="text-lg  font-semibold text-slate-800">{name}</h3>
        </div>

        {/* תיאור */}
        {description && (
          <p className="text-sm ms-14 text-slate-500 mb-3">{description}</p>
        )}

        {/* כפתור פעולה */}
        <button
          onClick={onclick}
          className="mt-auto w-full text-sm px-4 py-2 rounded border border-slate-300 bg-white text-slate-700 hover:shadow-md transition"
        >
          {actionName}
        </button>
      </div>
    </div>
  );
};

export default ActionCard;
