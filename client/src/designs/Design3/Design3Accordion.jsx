import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PropTypes from "prop-types";
import { useState, useRef } from "react";
import { useLanguage } from "../../context/LanguageContext";

const Design3Accordion = ({ categories, dishes }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const { language } = useLanguage();
  const categoryRefs = useRef({});

  // Sort categories by locationNumber
  const sortedCategories = [...categories].sort(
    (a, b) => a.locationNumber - b.locationNumber
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
      className="w-full pb-6"
      onValueChange={handleAccordionChange}
    >
      {sortedCategories
        .filter((category) => !category.hide)
        .map((category) => {
          const isActive = activeCategory === `item-${category._id}`;
          return (
            <AccordionItem
              key={category._id}
              value={`item-${category._id}`}
              ref={(el) => (categoryRefs.current[`item-${category._id}`] = el)}
              className="border-b border-white/15 mb-0"
            >
              <AccordionTrigger
                className={`
                  flex items-center w-full px-2 py-6 rounded-md transition-all duration-300
                  font-['Heebo',_sans-serif] text-[2rem] font-light no-underline hover:no-underline
                  hover:bg-white/5
                  [&>svg]:hidden
                  ${
                    isActive
                      ? "bg-white/5 text-[#f5f5f5]" 
                      : "bg-transparent text-[#f5f5f5]" 
                  }
                `}
              >
                <span className="flex-1 text-start">
                  {language === "en" && category.nameEn
                    ? category.nameEn
                    : category.name}
                </span>
                <span className={`text-[2rem] font-light font-['Montserrat',_sans-serif] leading-none transition-transform duration-500 will-change-transform ${isActive ? 'rotate-180' : ''}`}>
                  {isActive ? '−' : '+'}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                {dishes[category._id] && dishes[category._id].length > 0 ? (
                  <ul className="flex flex-col">
                    {dishes[category._id].map((dish) => (
                      <div
                        key={dish._id}
                        className="
                          relative grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 items-center
                          text-start py-6 px-2 transition-colors duration-300
                          hover:bg-white/[0.015] rounded-md
                        "
                        style={{
                          gridTemplateAreas: '"name price" "desc price"',
                        }}
                      >
                        {/* Dish Name */}
                        <li
                          className="text-[#f5f5f5] text-[1.2rem] font-medium tracking-[0.01em] font-['Heebo',_sans-serif] mb-0 flex justify-start"
                          style={{ gridArea: "name" }}
                        >
                          {language === "en" && dish.nameEn
                            ? dish.nameEn
                            : dish.name}
                        </li>

                        {/* Dish Description */}
                        <li
                          className="text-slate-400 text-[0.95rem] font-light leading-relaxed flex justify-start max-w-[95%]"
                          style={{ gridArea: "desc" }}
                        >
                          {language === "en" && dish.descriptionEn
                            ? dish.descriptionEn
                            : dish.description}
                        </li>

                        {/* Price */}
                        <li
                          className="flex flex-row justify-end items-center gap-3 text-[#f5f5f5] text-[1.15rem] font-normal font-['Montserrat',_sans-serif] min-w-max"
                          style={{ gridArea: "price" }}
                        >
                          {dish.salePrice &&
                          Number(dish.salePrice) > 0 &&
                          Number(dish.salePrice) !== Number(dish.price) ? (
                            <>
                              <span className="text-[1.2rem] font-medium text-[#f5f5f5]">
                                ₪ {dish.salePrice}
                              </span>
                              {dish.price && String(dish.price).trim() !== "" && String(dish.price) !== "0" && (
                                <span className="text-[0.95rem] text-slate-500 line-through decoration-slate-500">
                                  ₪ {dish.price}
                                </span>
                              )}
                            </>
                          ) : dish.price && String(dish.price).trim() !== "" && String(dish.price) !== "0" ? (
                            <span>₪ {dish.price}</span>
                          ) : null}
                        </li>
                      </div>
                    ))}
                  </ul>
                ) : (
                  <p className="text-start text-slate-400 p-6 italic font-light">
                    {language === "en" ? "No dishes available" : "אין מנות זמינות"}
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
    </Accordion>
  );
};

Design3Accordion.propTypes = {
  categories: PropTypes.array.isRequired,
  dishes: PropTypes.object.isRequired,
};

export default Design3Accordion;
