import {createPortal} from "react-dom";
import PropTypes from "prop-types";
import PrintMenuLayout from "./PrintMenuLayout";
import "./printMenu.css";

const PAPER_SIZE_MM = {
  A4: {width: 210, height: 297},
  A5: {width: 148, height: 210},
  LETTER: {width: 216, height: 279},
};

export default function PrintMenuPreview({
  user,
  menuCategories,
  config,
  qrCodeDataUrl,
  isPrinting,
  onBack,
  onClose,
  onPrint,
}) {
  const {width, height} = PAPER_SIZE_MM[config.paperSize] || PAPER_SIZE_MM.A4;

  return createPortal(
    <div id="print-menu-root">
      {/* Toolbar — screen only, never printed */}
      <div
        dir="rtl"
        className="print:hidden fixed inset-0 z-[100] bg-zinc-900/80 backdrop-blur-sm flex flex-col"
      >
        <div className="flex items-center justify-between gap-3 px-4 md:px-8 py-4 bg-white dark:bg-zinc-900 shadow-md shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBack}
              disabled={isPrinting}
              className="flex items-center gap-1 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors disabled:opacity-50"
            >
              <span className="material-icons-round text-lg">arrow_forward</span>
              חזרה להגדרות
            </button>
          </div>
          <h2 className="text-sm md:text-base font-semibold text-zinc-800 dark:text-zinc-100">
            תצוגה מקדימה להדפסה
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPrint}
              disabled={isPrinting}
              className="bg-primary-500 hover:bg-primary-dark disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors"
            >
              <span className="material-icons-round text-base">print</span>
              הדפסה / שמירה כ-PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isPrinting}
              className="w-9 h-9 flex items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50"
              aria-label="סגירה"
            >
              <span className="material-icons-round text-lg">close</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs md:text-sm border-b border-amber-200 dark:border-amber-900 shrink-0">
          <span className="material-icons-round text-base">info</span>
          לתוצאה נקייה ללא תאריך וכתובת אתר, בטלו את &quot;כותרות ותחתיות&quot; בחלון ההדפסה
        </div>

        <div className="flex-1 overflow-auto py-8 px-4 flex justify-center items-start">
          <div
            className="bg-white shadow-2xl shrink-0"
            style={{width: `${width}mm`, minHeight: `${height}mm`, padding: "15mm"}}
          >
            <PrintMenuLayout
              user={user}
              menuCategories={menuCategories}
              config={config}
              qrCodeDataUrl={qrCodeDataUrl}
            />
          </div>
        </div>
      </div>

      {/* Print-only copy — isolated from the preview chrome above (no backdrop, shadow,
          fixed positioning or scroll container) so what actually prints is exactly the
          menu content, laid out fresh by the browser's paginator. */}
      <div className="pm-print-only">
        <PrintMenuLayout
          user={user}
          menuCategories={menuCategories}
          config={config}
          qrCodeDataUrl={qrCodeDataUrl}
        />
      </div>
    </div>,
    document.body,
  );
}

PrintMenuPreview.propTypes = {
  user: PropTypes.object,
  menuCategories: PropTypes.array,
  config: PropTypes.object.isRequired,
  qrCodeDataUrl: PropTypes.string,
  isPrinting: PropTypes.bool,
  onBack: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onPrint: PropTypes.func.isRequired,
};
