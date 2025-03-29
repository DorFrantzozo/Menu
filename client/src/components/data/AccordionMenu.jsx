import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PropTypes from "prop-types";

import { useState } from "react";

const AccordionMenu = ({ categories, dishes, textColor = "white" }) => {
  const [activeCategory, setActiveCategory] = useState(null);

  // Sort categories by locationNumber
  const sortedCategories = [...categories].sort(
    (a, b) => a.locationNumber - b.locationNumber
  );

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      onValueChange={(value) => setActiveCategory(value)}
    >
      {sortedCategories
        .filter((category) => !category.hide)
        .map((category) => (
          <AccordionItem key={category._id} value={`item-${category._id}`}>
            <AccordionTrigger
              className={`text-2xl mb-8 mt-8 flex justify-center font-bold transition-colors duration-200 ${
                activeCategory === `item-${category._id}`
                  ? "text-sky-400 hover:text-sky-500"
                  : `text-${textColor} hover:text-gray-400`
              }`}
            >
              {category.name}
            </AccordionTrigger>
            <AccordionContent>
              {dishes[category._id] && dishes[category._id].length > 0 ? (
                <ul>
                  {dishes[category._id].map((dish) => (
                    <div className="text-center mb-8" key={dish._id}>
                      <li
                        className={`text-2xl font-semibold text-${textColor}`}
                      >
                        {dish.name}
                      </li>
                      <li className={`text-${textColor}`}>
                        {dish.description}
                      </li>
                      <li className="flex justify-center items-center gap-2">
                        <span className={`text-${textColor}`}>
                          ₪ {dish.price}
                        </span>
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
