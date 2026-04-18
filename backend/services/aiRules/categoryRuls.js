/**
 * בודק האם יש קטגוריות עם יותר מדי מנות (מעל 7)
 * @param {Array} categories - מערך הקטגוריות של המשתמש כולל המנות שבהן
 * @returns {Array} - רשימת ממצאים
 */

export const checkCategoryOverLoad = (categories) => {
    const findings = [];

    categories.forEach(category => {
        if (category.items && category.items.length > 7){
            findings.push({
                ruleId: 'CAT_OVERLOAD',
                categoryName: category.name,
                currentCount: category.items.length,
                suggestedCount: 7,
                // אנחנו שומרים מטא-דאטה כדי שה-AI יוכל להשתמש בזה בטקסט
                metaData: { 
                    categoryId: category._id, 
                    itemCount: category.items.length
                }
            })
        }
    })
    return findings;
}


export const checkThinCategories = (categories) => {
    const findings = [];

    categories.forEach(category => {
        if (category.items && category.items.length >= 1 && category.items.length <= 2) {
            findings.push({
                ruleId: 'THIN_CAT',
                categoryName: category.name,
                metaData: { categoryId: category._id }
            });
        }
    });

    return findings;
};

/**
 * בודק האם למנה יש תיאור דליל מדי או שאין תיאור כלל
 */
export const checkDishPoorDescription = (categories) => {
    const findings = [];

    categories.forEach(category => {
        if (category.items && category.items.length > 0) {
            category.items.forEach(dish => {
                const desc = dish.description || "";
                // חותכים את התיאור למילים ובודקים אם יש פחות מ-3 מילים
                const wordCount = desc.trim().split(/\s+/).filter(word => word.length > 0).length;

                if (wordCount < 3) {
                    findings.push({
                        ruleId: 'DISH_POOR_DESC',
                        categoryName: category.name,
                        metaData: { 
                            categoryId: category._id, 
                            dishId: dish._id,
                            dishName: dish.name,
                            currentWords: wordCount
                        }
                    });
                }
            });
        }
    });

    return findings;
};

/**
 * בודק האם יש מנות ספציפיות ללא תמונה
 * @param {Array} categories - מערך הקטגוריות של המשתמש כולל המנות שבהן
 * @returns {Array} - רשימת ממצאים
 */
export const checkDishMissingImage = (categories) => {
    const findings = [];

    categories.forEach(category => {
        if (category.items && category.items.length > 0) {
            category.items.forEach(dish => {
                // נבדוק אם שדה התמונה לא קיים או שהוא מחרוזת ריקה
                if (!dish.img || dish.img.trim() === '') {
                    findings.push({
                        ruleId: 'DISH_NO_IMAGE',
                        categoryName: category.name,
                        metaData: { 
                            categoryId: category._id, 
                            dishId: dish._id,
                            dishName: dish.name 
                        }
                    });
                }
            });
        }
    });

    return findings;
};
/**
 * בודק מנות עם חשיפה גבוהה אבל יחס המרה/לייקים נמוך
 * מעיד לרוב על תמחור בעייתי או תיאור לא משכנע
 */
export const checkHighViewsLowConversion = (categories) => {
    const findings = [];

    categories.forEach(category => {
        if (category.items && category.items.length > 0) {
            category.items.forEach(dish => {
                const views = dish.stats?.totalViews || 0;
                const likes = dish.stats?.totalLikes || 0;

                // הלוגיקה: לפחות 40 צפיות, אבל 2 לייקים או פחות
                if (views >= 40 && likes <= 2) {
                    findings.push({
                        ruleId: 'HIGH_VIEWS_LOW_CONVERSION',
                        categoryName: category.name,
                        metaData: {
                            categoryId: category._id,
                            dishId: dish._id,
                            dishName: dish.name,
                            price: dish.price || 0,
                            totalViews: views,
                            totalLikes: likes
                        }
                    });
                }
            });
        }
    });

    return findings;
};

export const checkHiddenGem = (categories) => {
    const findings = [];
    categories.forEach(category => {
        if (category.items && category.items.length > 0) {
            category.items.forEach(dish => {
                const views = dish.stats?.totalViews || 0;
                const likes = dish.stats?.totalLikes || 0;

                // הלוגיקה: פחות מ-20 צפיות, אבל לפחות 4 לייקים (יחס המרה של 20% ומעלה!)
                if (views > 5 && views <= 20 && likes >= 4) {
                    findings.push({
                        ruleId: 'HIDDEN_GEM_DISH',
                        categoryName: category.name,
                        metaData: {
                            categoryId: category._id,
                            dishId: dish._id,
                            dishName: dish.name,
                            totalViews: views,
                            totalLikes: likes
                        }
                    });
                }
            });
        }
    });
    return findings;
};

export const checkGhostDish = (categories) => {
    const findings = [];
    categories.forEach(category => {
        if (category.items && category.items.length > 0) {
            category.items.forEach(dish => {
                const views = dish.stats?.totalViews || 0;

                // הלוגיקה: כמעט אפס צפיות ב-30 יום
                if (views <= 5) {
                    findings.push({
                        ruleId: 'GHOST_DISH',
                        categoryName: category.name,
                        metaData: {
                            categoryId: category._id,
                            dishId: dish._id,
                            dishName: dish.name,
                            totalViews: views
                        }
                    });
                }
            });
        }
    });
    return findings;
};


export const checkInvisibleSale = (categories) => {
    const findings = [];
    categories.forEach(category => {
        if (category.items && category.items.length > 0) {
            category.items.forEach(dish => {
                const views = dish.stats?.totalViews || 0;
                const hasSale = dish.salePrice && dish.salePrice < dish.price;

                // הלוגיקה: המנה במבצע, אבל מקבלת מעט חשיפה (פחות מ-15 צפיות)
                if (hasSale && views < 15) {
                    findings.push({
                        ruleId: 'INVISIBLE_SALE_DISH',
                        categoryName: category.name,
                        metaData: {
                            categoryId: category._id,
                            dishId: dish._id,
                            dishName: dish.name,
                            price: dish.price,
                            salePrice: dish.salePrice,
                            totalViews: views
                        }
                    });
                }
            });
        }
    });
    return findings;
};