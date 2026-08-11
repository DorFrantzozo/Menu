import {Dialog, DialogBackdrop, DialogPanel, DialogTitle} from "@headlessui/react";
import PropTypes from "prop-types";
import LayoutSelector from "./LayoutSelector";
import ContentOptionsPanel from "./ContentOptionsPanel";
import ColorSchemeSelector from "./ColorSchemeSelector";
import {estimatePrintPageCount} from "@/utils/printMenu";

export default function PrintMenuModal({
  open,
  onClose,
  config,
  onConfigChange,
  onPreview,
  menuCategories,
}) {
  const pageEstimate = estimatePrintPageCount(menuCategories, config.layout);

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
      <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <DialogPanel
            dir="rtl"
            className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 text-right shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
          >
            <div className="p-6">
              <DialogTitle
                as="h3"
                className="text-lg font-semibold leading-6 text-gray-900 dark:text-zinc-50 mb-4 flex items-center gap-2"
              >
                <span className="material-icons-round text-primary-500">print</span>
                הגדרות הדפסה
              </DialogTitle>

              <div className="flex flex-col gap-5">
                <LayoutSelector
                  value={config.layout}
                  onChange={(layout) => onConfigChange({layout})}
                />
                <ContentOptionsPanel config={config} onChange={onConfigChange} />
                <ColorSchemeSelector
                  value={config.colorScheme}
                  onChange={(colorScheme) => onConfigChange({colorScheme})}
                />

                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {pageEstimate > 0
                    ? `≈ ${pageEstimate} עמודי ${config.paperSize} (הערכה)`
                    : "אין מנות להדפסה"}
                </p>
              </div>
            </div>

            <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-800/50 flex flex-row-reverse gap-2">
              <button
                type="button"
                onClick={onPreview}
                disabled={pageEstimate === 0}
                className="rounded-xl bg-primary-500 hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors flex items-center gap-2"
              >
                <span className="material-icons-round text-base">visibility</span>
                תצוגה מקדימה
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-white dark:bg-zinc-800 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-zinc-100 shadow-sm ring-1 ring-gray-300 dark:ring-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700"
              >
                ביטול
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

PrintMenuModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired,
  onConfigChange: PropTypes.func.isRequired,
  onPreview: PropTypes.func.isRequired,
  menuCategories: PropTypes.array,
};
