import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  isModalOpen: false,
  isPreviewOpen: false,
  isPrinting: false,
  config: {
    paperSize: "A4",
    layout: "premium",
    includeDescriptions: true,
    includeAllergens: true,
    includeContactInfo: false,
    includeQrCode: true,
    colorScheme: "default",
  },
};

const printMenuSlice = createSlice({
  name: "printMenu",
  initialState,
  reducers: {
    openPrintMenuModal: (state) => {
      state.isModalOpen = true;
    },
    closePrintMenuModal: (state) => {
      state.isModalOpen = false;
    },
    openPrintPreview: (state) => {
      state.isModalOpen = false;
      state.isPreviewOpen = true;
    },
    backToPrintSettings: (state) => {
      state.isPreviewOpen = false;
      state.isModalOpen = true;
    },
    closePrintPreview: (state) => {
      state.isPreviewOpen = false;
    },
    updatePrintMenuConfig: (state, action) => {
      state.config = {...state.config, ...action.payload};
    },
    printStarted: (state) => {
      state.isPrinting = true;
    },
    printFinished: (state) => {
      state.isPrinting = false;
    },
  },
});

export const {
  openPrintMenuModal,
  closePrintMenuModal,
  openPrintPreview,
  backToPrintSettings,
  closePrintPreview,
  updatePrintMenuConfig,
  printStarted,
  printFinished,
} = printMenuSlice.actions;

export default printMenuSlice.reducer;
