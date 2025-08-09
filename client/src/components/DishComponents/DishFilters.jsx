import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import DropDown from "../DropDown";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";

const sensitivityOptions = [
  { label: "כל סוגי הרגישויות", value: "" },
  { label: "מתאים להריוניות בלבד", value: "pregnant" },
  { label: "מתאים לגלוטן בלבד", value: "gluten" },
  { label: "מתאים ללקטוז בלבד", value: "lactose" },
  { label: "מתאים לצמחוניים בלבד", value: "vegi" },
];

export default function DishFilters({
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
  filterSensitivity,
  setFilterSensitivity,
  categories,
}) {

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {/* חיפוש */}
      <div className="relative flex-1 max-w-md">
        
             <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
    
      <input
        type="search"
        placeholder={`חפש מנה... `}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className=" w-full appirance-none py-2 pr-4 pl-10 border border-gray-300 rounded-md bg-white text-right focus:outline-none focus:ring-2 focus:ring-amber-400"
       
        />
        </div>

      {/* קטגוריה */}
      <select
        value={filterCategory}
        onChange={(e) => setFilterCategory(e.target.value)}
        className="w-full appearance-none py-2 border border-gray-300 rounded-md bg-white text-right focus:outline-none focus:ring-2 focus:ring-amber-400"
       
      
      >
        <option value="">כל הקטגוריות</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* רגישויות */}
      <select
        value={filterSensitivity}
        onChange={(e) => setFilterSensitivity(e.target.value)}
        className=" w-full appearance-none py-2 border border-gray-300 rounded-md bg-white text-right focus:outline-none focus:ring-2 focus:ring-amber-400"
        
      >
        {sensitivityOptions.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
