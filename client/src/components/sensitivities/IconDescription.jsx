import milk from "../../assets/img/milk.png";
import pregnant from "../../assets/img/pregnant.png";
import gluten from "../../assets/img/gluten.png";
import vegi from "../../assets/img/vegetable.png";

const IconDescription = () => {
  return (
    <div className="flex flex-wrap justify-center items-center gap-4 w-[90%] md:w-[75%] mx-auto mt-4 mb-4">
      <div className="flex items-center gap-2">
        <p className="text-sm md:text-base">מתאים לרגישים ללקטוז -</p>
        <img src={milk} className="w-5 md:w-6" alt="milk-icon" />
      </div>
      <div className="flex items-center gap-2">
        <p className="text-sm md:text-base">מתאים להריוניות -</p>
        <img src={pregnant} className="w-5 md:w-6" alt="pregnant-icon" />
      </div>
      <div className="flex items-center gap-2">
        <p className="text-sm md:text-base">מתאים לרגישים לגלוטן -</p>
        <img src={gluten} className="w-5 md:w-6" alt="gluten-icon" />
      </div>
      <div className="flex items-center gap-2">
        <p className="text-sm md:text-base">מתאים לצמחוניים -</p>
        <img src={vegi} className="w-5 md:w-6" alt="vegi-icon" />
      </div>
    </div>
  );
};

export default IconDescription;
