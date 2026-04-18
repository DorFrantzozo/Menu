import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { XMarkIcon, PhotoIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { scanMenuImage, saveFinalMenu } from "../../../services/aiApiService";
import ScanLoading from "./ScanLoading";
import ReviewTable from "./ReviewTable";
import { useDispatch, useSelector } from "react-redux";
import {
  setMenuCategories,
} from "@/state/menu/menuCategoriesSlice";
import {
  getAllDishesAndMapToCategories,
  getCategories,
} from "@/utils/fetchData";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../utils/baseUrl";

export default function MenuScannerModal({ open, setOpen }) {
  const [step, setStep] = useState(1); // 1 = Upload, 2 = Loading, 3 = Review
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  
  const fileInputRef = useRef(null);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        toast.error("אנא בחר קובץ תמונה חוקי.");
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      toast.error("אנא גרור קובץ תמונה חוקי.");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const startScan = async () => {
    if (!selectedFile) return;
    
    setStep(2); // Move to Loading step
    setRetryAttempt(1);
    
    let attempt = 1;
    const maxAttempts = 3;

    while (attempt <= maxAttempts) {
      try {
        console.count("API Call Triggered");
        const data = await scanMenuImage(selectedFile);
        
        if (data && data.scannedItems && data.scannedItems.length > 0) {
          setParsedData(data.scannedItems);
          toast.success("הסריקה הושלמה בהצלחה!");
        } else {
          setParsedData([
            { name: "דוגמה: המבורגר הבית", description: "קציצת בקר 200 גרם, חסה, עגבניה", price: "59", category: "עיקריות" },
          ]);
          toast.warning("לא נמצאו נתונים מדויקים, הוזן מידע לדוגמה.");
        }
        setStep(3); // Move to Review step
        return; // Success, exit loop
      } catch (error) {
        const is503 = error.response && error.response.status === 503;
        if (is503 && attempt < maxAttempts) {
          attempt++;
          setRetryAttempt(attempt);
          const waitTime = attempt === 2 ? 2000 : 4000;
          await new Promise(res => setTimeout(res, waitTime));
        } else {
          console.error("Scanning failed:", error);
          if (is503) {
            toast.error("The AI server is currently overloaded. Please wait 60 seconds and try scanning again.");
          } else {
            toast.error("שגיאה בסריקת התמונה. נסה שוב.");
          }
          setStep(1);
          setRetryAttempt(0);
          return; // Exit loop on final failure
        }
      }
    }
  };

  const confirmAndSave = async () => {
    if (parsedData.length === 0) {
      toast.error("אין נתונים לשמירה.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Upload pending images first in parallel
      const updatedDataWithRemoteUrls = await Promise.all(
        parsedData.map(async (item) => {
          if (item.rawFile) {
            const formData = new FormData();
            formData.append("img", item.rawFile);
            formData.append("type", "image");
            formData.append("fileName", item.rawFile.name);

            const response = await axiosInstance.post(
              `/asset/uploadAsset/${user._id}`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            
            // Collect remote URL and cleanup local blob/file
            if (item.imageUrl?.startsWith('blob:')) {
              URL.revokeObjectURL(item.imageUrl);
            }
            return { ...item, imageUrl: response.data.url, rawFile: undefined };
          }
          return item;
        })
      );

      // 2. Group items into nested categories object
      const categoryGroups = {};
      for (const item of updatedDataWithRemoteUrls) {
        const catName = item.category || "כללי";
        if (!categoryGroups[catName]) categoryGroups[catName] = { name: catName, items: [] };
        categoryGroups[catName].items.push(item);
      }
      
      const structuredPayload = {
        userId: user._id,
        categories: Object.values(categoryGroups)
      };

      await saveFinalMenu(structuredPayload);
      
      // Refresh the Dashboard categories
      const categories = await getCategories(user._id);
      const categoriesWithDishes = await getAllDishesAndMapToCategories(
        user,
        categories
      );
      dispatch(setMenuCategories(categoriesWithDishes));
      
      toast.success("הנתונים נשמרו בהצלחה!");
      closeModal();
      navigate("/"); // Refresh dashboard view
    } catch (error) {
      console.error("Verification failed:", error);
      toast.error("שגיאה בשמירת הנתונים. נסה שוב.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseAttempt = () => {
    // If we're scanning or have data, ask for confirmation
    if (step === 2 || (step === 3 && parsedData.length > 0)) {
      setShowExitConfirm(true);
      return;
    }
    closeModal();
  };

  const closeModal = () => {
    setOpen(false);
    setTimeout(() => {
      // Cleanup any remaining blob URLs to prevent memory leaks
      parsedData.forEach(item => {
        if (item.imageUrl?.startsWith('blob:')) {
          URL.revokeObjectURL(item.imageUrl);
        }
      });
      if (previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }

      setStep(1);
      setRetryAttempt(0);
      setSelectedFile(null);
      setPreviewUrl(null);
      setParsedData([]);
    }, 300); // Reset state after animation
  };

  return (
    <Dialog open={open} onClose={handleCloseAttempt} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />
      <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <DialogPanel
            transition
            className={`relative transform overflow-hidden rounded-xl bg-white dark:bg-zinc-900 text-left shadow-2xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 w-full ${step === 3 ? 'sm:max-w-[95vw] lg:max-w-7xl' : 'sm:max-w-xl'} data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-zinc-800" dir="rtl">
              <DialogTitle className="text-xl font-bold leading-6 text-gray-900 dark:text-white flex items-center gap-2">
                <SparklesIcon className="h-6 w-6 text-blue-500" />
                <span>סריקת תפריט חכמה (AI)</span>
              </DialogTitle>
              <button
                type="button"
                onClick={handleCloseAttempt}
                className="rounded-full bg-white dark:bg-zinc-800 p-1 text-gray-400 hover:text-gray-500 dark:hover:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <span className="sr-only">סגור</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            {/* Content Body */}
            <div className="px-6 py-6 pb-8">
              {step === 1 && (
                <div className="flex flex-col items-center">
                  <div className="text-center mb-6" dir="rtl">
                    <p className="text-sm text-gray-500 dark:text-zinc-400">
                      העלה תמונה של התפריט הפיזי שלך, והבינה המלאכותית שלנו תחרוץ אוטומטית מנות, מחירים ותיאורים ישירות למערכת.
                    </p>
                  </div>

                  <div
                    className={`mt-2 flex justify-center rounded-xl border border-dashed border-gray-300 dark:border-zinc-700 px-6 py-12 w-full transition-colors ${previewUrl ? 'bg-gray-50 dark:bg-zinc-800/50 hover:bg-gray-100 dark:hover:bg-zinc-800' : 'bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800'}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current.click()}
                  >
                    <div className="text-center cursor-pointer">
                      {previewUrl ? (
                        <div className="flex flex-col items-center">
                          <img src={previewUrl} alt="Preview" className="h-40 object-cover rounded-lg shadow-sm mb-4" />
                          <p className="text-sm text-blue-600 font-medium">לחץ כדי לשנות תמונה</p>
                        </div>
                      ) : (
                        <>
                          <PhotoIcon className="mx-auto h-16 w-16 text-gray-300 dark:text-zinc-600" aria-hidden="true" />
                          <div className="mt-4 flex text-sm leading-6 text-gray-600 dark:text-zinc-400 justify-center">
                            <span className="relative cursor-pointer rounded-md font-semibold text-blue-600 hover:text-blue-500">
                              <span>העלה קובץ</span>
                            </span>
                            <p className="pl-1"> או גרור לכאן</p>
                          </div>
                          <p className="text-xs leading-5 text-gray-500 dark:text-zinc-500 mt-2">PNG, JPG עד 10MB</p>
                        </>
                      )}
                    </div>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                  />

                  <div className="mt-8 w-full flex justify-center">
                    <button
                      type="button"
                      onClick={startScan}
                      disabled={!selectedFile}
                      className={`flex items-center gap-2 rounded-lg px-8 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 ${!selectedFile ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 hover:shadow-lg hover:-translate-y-0.5'}`}
                    >
                      <SparklesIcon className="h-5 w-5" />
                      התחל סריקה
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && <ScanLoading retryAttempt={retryAttempt} />}

              {step === 3 && (
                <div className="flex flex-col h-full">
                  <ReviewTable data={parsedData} setData={setParsedData} user={user} />
                  
                  <div className="mt-8 flex items-center justify-between pt-4 border-t border-gray-100 dark:border-zinc-800" dir="rtl">
                     <button
                        type="button"
                        onClick={confirmAndSave}
                        disabled={isSubmitting}
                        className={`rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 transition-colors flex items-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {isSubmitting ? (
                          <>
                           <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                           <span>שומר...</span>
                          </>
                        ) : (
                          'אשר ושמור בתפריט'
                        )}
                      </button>
                      <div></div> {/* Empty div to maintain space-between if needed, or just let Save button be alone */}
                  </div>
                </div>
              )}
            </div>
          </DialogPanel>
        </div>
      </div>

      {/* Custom Exit Confirmation Modal */}
      <Dialog open={showExitConfirm} onClose={() => setShowExitConfirm(false)} className="relative z-[60]">
        <DialogBackdrop transition className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity data-[closed]:opacity-0" />
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <DialogPanel transition className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 p-6 text-right shadow-2xl transition-all w-full max-w-md border dark:border-zinc-800">
            <div className="text-center sm:text-right">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 sm:mx-0 sm:h-10 sm:w-10">
                <SparklesIcon className="h-6 w-6 text-amber-600 dark:text-amber-500" aria-hidden="true" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:mr-4 sm:text-right">
                <DialogTitle as="h3" className="text-xl font-bold leading-6 text-gray-900 dark:text-white">
                  האם לצאת מהסריקה?
                </DialogTitle>
                <div className="mt-4">
                  <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed font-medium">
                    שימו לב: הסריקה תבוטל וכל המידע שנסרק עד כה ילך לאיבוד. תצטרכו לבצע סריקה חדשה בפעם הבאה.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row-reverse gap-3">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-xl bg-red-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-red-500 sm:w-auto transition-all active:scale-95"
                onClick={() => {
                  setShowExitConfirm(false);
                  closeModal();
                }}
              >
                יציאה וביטול
              </button>
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-xl bg-white dark:bg-zinc-800 px-6 py-2.5 text-sm font-bold text-gray-900 dark:text-zinc-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 sm:w-auto transition-all active:scale-95"
                onClick={() => setShowExitConfirm(false)}
              >
                המשך בעבודה
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </Dialog>
  );
}
