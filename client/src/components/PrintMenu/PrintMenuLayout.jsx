import PropTypes from "prop-types";
// Dedicated copies (not the ones Allergies.jsx/IconDescription.jsx use elsewhere in the
// app) living under assets/img/print/, which vite.config.js force-inlines as base64 —
// printing must never depend on a separate network image request finishing before
// window.print() fires. Using our own copies keeps that inlining scoped to this feature
// instead of changing how these icons load on the live public menu pages.
import milkIcon from "../../assets/img/print/milk.png";
import pregnantIcon from "../../assets/img/print/pregnant.png";
import glutenIcon from "../../assets/img/print/gluten.png";
import vegiIcon from "../../assets/img/print/vegetable.png";
import {getPrintableCategories, isHebrewText} from "@/utils/printMenu";

const PAGE_SIZE_CSS = {
  A4: "A4",
  A5: "A5",
  LETTER: "letter",
};

const ALLERGEN_ICONS = [
  {key: "lactose", src: milkIcon, label: "מכיל לקטוז"},
  {key: "gluten", src: glutenIcon, label: "מכיל גלוטן"},
  {key: "pregnant", src: pregnantIcon, label: "מתאים להריוניות"},
  {key: "vegi", src: vegiIcon, label: "צמחוני/טבעוני"},
];

function DirText({as: Tag = "span", text, className}) {
  if (!text) return null;
  const dir = isHebrewText(text) ? "rtl" : "ltr";
  return (
    <Tag dir={dir} className={className}>
      {text}
    </Tag>
  );
}

function DishRow({dish, config}) {
  const hasDescription = config.includeDescriptions && !!dish.description?.trim();
  const activeAllergens = config.includeAllergens
    ? ALLERGEN_ICONS.filter((a) => dish[a.key])
    : [];
  const hasSale =
    dish.salePrice && Number(dish.salePrice) > 0 && Number(dish.salePrice) !== dish.price;

  return (
    <div className="pm-dish">
      <div className="pm-dish-header">
        <DirText as="h3" text={dish.name} className="pm-dish-name" />
        {hasSale ? (
          <span className="pm-price">
            <span className="pm-price-sale">₪{dish.salePrice}</span>
            <span className="pm-price-original">₪{dish.price}</span>
          </span>
        ) : (
          <span className="pm-price">₪{dish.price}</span>
        )}
      </div>
      {activeAllergens.length > 0 && (
        <div className="pm-allergens">
          {activeAllergens.map((a) => (
            <img key={a.key} src={a.src} alt={a.label} title={a.label} className="pm-allergen-icon" />
          ))}
        </div>
      )}
      {hasDescription && <p className="pm-description">{dish.description}</p>}
    </div>
  );
}

function CategoryBlock({category, config}) {
  return (
    <div className="pm-category">
      <DirText as="h2" text={category.name} className="pm-category-title" />
      <div className="pm-dishes">
        {category.menuDishes.map((dish) => (
          <DishRow key={dish._id} dish={dish} config={config} />
        ))}
      </div>
    </div>
  );
}

export default function PrintMenuLayout({user, menuCategories, config, qrCodeDataUrl}) {
  const printableCategories = getPrintableCategories(menuCategories);
  const pageSize = PAGE_SIZE_CSS[config.paperSize] || "A4";
  const hasContactInfo =
    config.includeContactInfo && (user?.phone || user?.addressSettings?.isEnabled);

  return (
    <div className={`pm-root pm-layout-${config.layout} pm-scheme-${config.colorScheme}`} dir="rtl">
      <style>{`@page { size: ${pageSize}; margin: 15mm; }`}</style>

      <header className="pm-header">
        <DirText as="h1" text={user?.restaurantName} className="pm-title" />
        {user?.menuDescription && (
          <DirText as="p" text={user.menuDescription} className="pm-subtitle" />
        )}
      </header>

      <div className="pm-categories">
        {printableCategories.map((category) => (
          <CategoryBlock key={category._id} category={category} config={config} />
        ))}
      </div>

      {(hasContactInfo || (config.includeQrCode && qrCodeDataUrl)) && (
        <footer className="pm-footer">
          {hasContactInfo && (
            <div className="pm-contact">
              {user?.phone && <span>{user.phone}</span>}
              {user?.addressSettings?.isEnabled && user?.addressSettings?.address && (
                <span>{user.addressSettings.address}</span>
              )}
            </div>
          )}
          {config.includeQrCode && qrCodeDataUrl && (
            <div className="pm-qr">
              <img src={qrCodeDataUrl} alt="QR לתפריט הדיגיטלי" />
              <span>סרקו לתפריט הדיגיטלי המלא</span>
            </div>
          )}
        </footer>
      )}

      {/* position: fixed only under @media print (see printMenu.css) — Chrome/Edge repeat
          fixed-position elements on every printed page, unlike CSS Paged Media running
          footers, which browsers barely support. Not shown in the on-screen preview,
          which has no real page breaks to repeat it against. */}
      <div className="pm-powered-by">POWERED BY IMENU</div>
    </div>
  );
}

PrintMenuLayout.propTypes = {
  user: PropTypes.object,
  menuCategories: PropTypes.array,
  config: PropTypes.object.isRequired,
  qrCodeDataUrl: PropTypes.string,
};
