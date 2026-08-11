import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
  openPrintMenuModal,
  closePrintMenuModal,
  openPrintPreview,
  backToPrintSettings,
  closePrintPreview,
  updatePrintMenuConfig,
  printStarted,
  printFinished,
} from "@/state/printMenu/printMenuSlice";
import {generateQRCode} from "@/utils/qrGenerator";

export function usePrintMenu(user) {
  const dispatch = useDispatch();
  const {isModalOpen, isPreviewOpen, isPrinting, config} = useSelector(
    (state) => state.printMenu,
  );
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState(null);

  useEffect(() => {
    if (!config.includeQrCode || !user?.qrSlug) {
      setQrCodeDataUrl(null);
      return;
    }
    let cancelled = false;
    generateQRCode(user.qrSlug).then((url) => {
      if (!cancelled) setQrCodeDataUrl(url);
    });
    return () => {
      cancelled = true;
    };
  }, [config.includeQrCode, user?.qrSlug]);

  useEffect(() => {
    const handleAfterPrint = () => dispatch(printFinished());
    window.addEventListener("afterprint", handleAfterPrint);
    return () => window.removeEventListener("afterprint", handleAfterPrint);
  }, [dispatch]);

  const handlePrint = () => {
    dispatch(printStarted());
    requestAnimationFrame(() => window.print());
  };

  return {
    isModalOpen,
    isPreviewOpen,
    isPrinting,
    config,
    qrCodeDataUrl,
    openModal: () => dispatch(openPrintMenuModal()),
    closeModal: () => dispatch(closePrintMenuModal()),
    openPreview: () => dispatch(openPrintPreview()),
    backToSettings: () => dispatch(backToPrintSettings()),
    closePreview: () => dispatch(closePrintPreview()),
    updateConfig: (patch) => dispatch(updatePrintMenuConfig(patch)),
    handlePrint,
  };
}
