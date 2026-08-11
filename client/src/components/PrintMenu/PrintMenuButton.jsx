import PropTypes from "prop-types";
import {usePrintMenu} from "@/hooks/usePrintMenu";
import PrintMenuModal from "./PrintMenuModal";
import PrintMenuPreview from "./PrintMenuPreview";

export default function PrintMenuButton({user, menuCategories}) {
  const {
    isModalOpen,
    isPreviewOpen,
    isPrinting,
    config,
    qrCodeDataUrl,
    openModal,
    closeModal,
    openPreview,
    backToSettings,
    closePreview,
    updateConfig,
    handlePrint,
  } = usePrintMenu(user);

  const hasMenu = menuCategories?.some((category) => category.menuDishes?.length > 0);

  return (
    <>
      <button
        onClick={openModal}
        disabled={!hasMenu}
        className="bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 px-3 md:px-5 py-2 md:py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm transition-all active:scale-95 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="material-icons-round text-base">print</span>
        <span className="hidden md:inline">הדפס תפריט</span>
      </button>

      {isModalOpen && (
        <PrintMenuModal
          open={isModalOpen}
          onClose={closeModal}
          config={config}
          onConfigChange={updateConfig}
          onPreview={openPreview}
          menuCategories={menuCategories}
        />
      )}

      {isPreviewOpen && (
        <PrintMenuPreview
          user={user}
          menuCategories={menuCategories}
          config={config}
          qrCodeDataUrl={qrCodeDataUrl}
          isPrinting={isPrinting}
          onBack={backToSettings}
          onClose={closePreview}
          onPrint={handlePrint}
        />
      )}
    </>
  );
}

PrintMenuButton.propTypes = {
  user: PropTypes.object,
  menuCategories: PropTypes.array,
};
