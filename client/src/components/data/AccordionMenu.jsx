import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PropTypes from "prop-types";

import {useState, useRef} from "react";
import {useLanguage} from "../../context/LanguageContext";

const AccordionMenu = ({categories, dishes, textColor = "white"}) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const {language} = useLanguage();
  const categoryRefs = useRef({});

  // Sort categories by locationNumber
  const sortedCategories = [...categories].sort(
    (a, b) => a.locationNumber - b.locationNumber,
  );

  const handleAccordionChange = (value) => {
    setActiveCategory(value);
    if (value) {
      setTimeout(() => {
        if (categoryRefs.current[value]) {
          categoryRefs.current[value].scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 300);
    }
  };

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      onValueChange={handleAccordionChange}
    >
      {sortedCategories
        .filter((category) => !category.hide)
        .map((category) => (
          <AccordionItem 
            key={category._id} 
            value={`item-${category._id}`}
            ref={(el) => (categoryRefs.current[`item-${category._id}`] = el)}
          >
            <AccordionTrigger
              className={`text-2xl mb-8 mt-8 flex justify-center text-center font-bold transition-colors duration-200 ${
                activeCategory === `item-${category._id}`
                  ? "text-sky-400 hover:text-sky-500"
                  : `text-${textColor} hover:text-gray-400`
              }`}
            >
              <span className="break-words max-w-[90%]">
                {language === "en" && category.nameEn
                  ? category.nameEn
                  : category.name}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              {dishes[category._id] && dishes[category._id].length > 0 ? (
                <ul>
                  {dishes[category._id].map((dish) => (
                    <div className="text-center mb-8 relative" key={dish._id}>
                      <li
                        className={`text-2xl font-semibold text-${textColor}`}
                      >
                        {language === "en" && dish.nameEn
                          ? dish.nameEn
                          : dish.name}
                      </li>
                      <li className={`text-${textColor}`}>
                        {language === "en" && dish.descriptionEn
                          ? dish.descriptionEn
                          : dish.description}
                      </li>
                      <li className="flex justify-center items-center gap-2">
                        {dish.salePrice &&
                        Number(dish.salePrice) > 0 &&
                        Number(dish.salePrice) !== dish.price ? (
                          <>
                            <span className="text-lg text-emerald-600 font-bold">
                              ₪ {dish.salePrice}
                            </span>
                            <span
                              className={`text-sm text-red-500 line-through opacity-70`}
                            >
                              ₪ {dish.price}
                            </span>
                          </>
                        ) : (
                          <span className={`text-${textColor}`}>
                            ₪ {dish.price}
                          </span>
                        )}
                      </li>
                    </div>
                  ))}
                </ul>
              ) : (
                <p className={`text-${textColor}`}>אין מנות זמינות</p>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
    </Accordion>
  );
};

export default AccordionMenu;

AccordionMenu.propTypes = {
  categories: PropTypes.array.isRequired,
  dishes: PropTypes.object.isRequired,
  textColor: PropTypes.string,
};
