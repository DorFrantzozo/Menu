export const parseMenuData = (rawData, supportsSubCategories) => {
  if (!supportsSubCategories) {
    let parsedDishes = [];
    if (Array.isArray(rawData)) {
      rawData.forEach((item) => {
        if (item.subCategories) {
          item.subCategories.forEach((sub) => {
            if (sub.dishes) parsedDishes.push(...sub.dishes);
          });
        } else if (item.dishes) {
          parsedDishes.push(...item.dishes);
        } else {
          parsedDishes.push(item);
        }
      });
    } else if (rawData.subCategories) {
      rawData.subCategories.forEach((sub) => {
        if (sub.dishes) parsedDishes.push(...sub.dishes);
      });
    } else if (rawData.dishes) {
      parsedDishes = rawData.dishes;
    } else {
      parsedDishes = Array.isArray(rawData) ? rawData : [];
    }
    return parsedDishes;
  }
  
  // If sub-categories are supported, return the nested structure
  return Array.isArray(rawData) ? rawData : [rawData];
};
