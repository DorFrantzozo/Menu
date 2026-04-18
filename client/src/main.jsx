import {createRoot} from "react-dom/client";
import App from "./App.jsx";
import {Provider} from "react-redux";
import store from "./state/store.js";
import GlobalErrorBoundary from "./components/GlobalErrorBoundary.jsx";
import {LanguageProvider} from "./context/LanguageContext.jsx";

createRoot(document.getElementById("root")).render(
  <GlobalErrorBoundary>
    <Provider store={store}>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </Provider>
  </GlobalErrorBoundary>,
);
