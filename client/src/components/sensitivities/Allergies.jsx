import {useState} from "react";
import PropTypes from "prop-types";
import milk from "../../assets/img/milk.png";
import pregnant from "../../assets/img/pregnant.png";
import gluten from "../../assets/img/gluten.png";
import vegi from "../../assets/img/vegetable.png";

const Allergies = ({dish}) => {
  const [hoveredId, setHoveredId] = useState(null);

  const allergyConfig = [
    {id: "lactose", src: milk, label: "מתאים לרגישות ללקטוז "},
    {id: "gluten", src: gluten, label: "מתאים לרגישות לגלוטן "},
    {id: "pregnant", src: pregnant, label: "מתאים לנשים בהריון"},
    {id: "vegi", src: vegi, label: "מתאים לצמחונים / טבעונים"},
  ];

  return (
    <div className="flex gap-3 justify-end px-2">
      {" "}
      {/* הוספתי padding קטן למניעת היצמדות מוחלטת */}
      {allergyConfig.map((allergy) => {
        if (!dish[allergy.id]) return null;

        return (
          <div
            key={allergy.id}
            className="relative flex items-center justify-center"
            onMouseEnter={() => setHoveredId(allergy.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() =>
              setHoveredId(hoveredId === allergy.id ? null : allergy.id)
            }
          >
            <img
              src={allergy.src}
              alt={allergy.label}
              width={25}
              height={25}
              className="cursor-help"
            />

            {hoveredId === allergy.id && (
              <div
                className="absolute bottom-full mb-2 z-[100] 
                              /* שינוי כאן: במקום left-1/2, נצמיד לימין כדי שלא יברח החוצה */
                              right-0 
                              whitespace-nowrap bg-white dark:bg-zinc-800 
                              px-3 py-1.5 rounded-lg shadow-xl border border-zinc-100 
                              dark:border-zinc-700 text-xs font-medium text-zinc-900 
                              dark:text-white animate-in fade-in zoom-in-95 duration-200"
              >
                {allergy.label}

                {/* משולש קטן - מוצמד לימין האייקון */}
                <div className="absolute top-full right-[6px] border-8 border-transparent border-t-white dark:border-t-zinc-800" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Allergies;
