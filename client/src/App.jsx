import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Footer from "./components/Footer";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {useSelector} from "react-redux";
import AddDish from "./components/AddDish";
import Dashboard from "./pages/Dashboard";
import AddCategory from "./components/AddCategory";
import DishPage from "./pages/DishPage";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {setUser} from "./state/user/userSlice";
import {
  getCategories,
  getAllDishesAndMapToCategories,
  getFreshUser,
} from "@/utils/fetchData";
import Profile from "./pages/Profile";
import Menu from "./pages/Menu";
import Designs from "./pages/Designs";
import {DESIGN_NUMBERS, DESIGNS} from "./designs/registry";
import Design1Dish from "./designs/Design1/Design1Dish";
import AddAssetsPage from "./pages/AddAssetsPage";
import Landing2 from "./pages/Landing2";
import AdminPage from "./pages/AdminPage";
import {Analytics} from "@vercel/analytics/react";
import {setMenuCategories} from "./state/menu/menuCategoriesSlice";
import ScrollToTop from "./components/ScrollToTop";
import TermsOfService from "./pages/TermsOfService";
import Settings from "./pages/Settings";
import SendLinkToEmail from "./pages/SendLinkToEmail";
import {AnimatePresence} from "framer-motion";
import DishDetails from "./designs/Design4/Design4DishDetails";
import EditProfile from "./pages/EditProfile";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import ManageCategories from "./pages/ManageCategories";
import ManageDishes from "./pages/ManageDishes";
import Sidebar from "./components/SideBar";
import SupportPage from "./pages/SupportPage";
import GlobalErrorBoundary from "./components/GlobalErrorBoundary";
import OnboardingTour from "./components/Dashboard/TourFix";
import {ThemeProvider} from "./context/ThemeContext";
import TrialBanner from "./components/banner/TrialBanner";
import TrialExpiredOverlay from "./components/Dashboard/TrialExpiredOverlay";
import Upgrade from "./pages/Upgrade";
import SuccessPage from "./pages/payment/SuccessPaymentPage";
import CheckoutPage from "./pages/payment/CheckoutPage";
import Accessibility from "./pages/legal/Accessibility";
import AuthPage from "./pages/AuthPage";
import AIInsightsPage from "./pages/AIInsights/AIInsightsPage";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedCategories = localStorage.getItem("categories");

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      dispatch(setUser(parsedUser));

      const syncUser = async () => {
        try {
          const freshUser = await getFreshUser();
          if (freshUser) {
            dispatch(setUser(freshUser));
            localStorage.setItem("user", JSON.stringify(freshUser));
          }
        } catch (error) {
          if (error.response?.status === 401) {
            dispatch(setUser(null));
            localStorage.removeItem("user");
            localStorage.removeItem("token");
          } else {
            // Anything else leaves the cached user in place, where it can go
            // stale indefinitely without any visible symptom. Surface it.
            console.error("Failed to sync user from server:", error);
          }
        }
      };
      syncUser();

      if (savedCategories) {
        const parsedCategories = JSON.parse(savedCategories);
        if (Array.isArray(parsedCategories) && parsedCategories.length > 0) {
          dispatch(setMenuCategories(parsedCategories));
        } else {
          // Fetch data if localStorage is empty array
          const fetchData = async () => {
            try {
              const categories = await getCategories(parsedUser._id);
              const categoriesWithDishes = await getAllDishesAndMapToCategories(
                parsedUser,
                categories,
              );
              dispatch(setMenuCategories(categoriesWithDishes));
              localStorage.setItem(
                "categories",
                JSON.stringify(categoriesWithDishes),
              );
            } catch (error) {
              console.error("Error fetching data in App.jsx:", error);
            }
          };
          fetchData();
        }
      } else {
        // Fetch data if missing in localStorage but user exists
        const fetchData = async () => {
          try {
            const categories = await getCategories(parsedUser._id);
            const categoriesWithDishes = await getAllDishesAndMapToCategories(
              parsedUser,
              categories,
            );
            dispatch(setMenuCategories(categoriesWithDishes));
            localStorage.setItem(
              "categories",
              JSON.stringify(categoriesWithDishes),
            );
          } catch (error) {
            console.error("Error fetching data in App.jsx:", error);
          }
        };
        fetchData();
      }
    }
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-200">
      <BrowserRouter>
        <ThemeProvider>
          <ScrollToTop />
          <Analytics />
          {user && user.role !== "admin" && <TrialBanner />}

          <div className="flex flex-grow overflow-hidden relative">
            {user && user.role !== "admin" && (
              <TrialExpiredOverlay forceShow={false} />
            )}
            <main className="flex-grow min-w-0 overflow-x-hidden">
              <GlobalErrorBoundary>
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route
                      path="/"
                      element={
                        user ? <Navigate to="/dashboard" /> : <Landing2 />
                      }
                    />
                    <Route
                      path="/dashboard"
                      element={user ? <Dashboard /> : <Navigate to="/auth" />}
                    />
                    <Route
                      path="/upgrade"
                      element={user ? <Upgrade /> : <Navigate to="/auth" />}
                    />
                    <Route
                      path="/auth"
                      element={
                        user ? <Navigate to="/dashboard" /> : <AuthPage />
                      }
                    />

                    <Route
                      path="/admin"
                      element={
                        !user || user.role !== "admin" ? (
                          <Navigate to="/" />
                        ) : (
                          <AdminPage />
                        )
                      }
                    />
                    <Route
                      path="/designs"
                      element={user ? <Designs /> : <Landing2 />}
                    />
                    <Route
                      path="/settings"
                      element={user ? <Settings /> : <Landing2 />}
                    />
                    <Route
                      path="/add-dish"
                      element={user ? <AddDish /> : <Landing2 />}
                    />
                    <Route
                      path="/manage-categories"
                      element={user ? <ManageCategories /> : <Landing2 />}
                    />
                    <Route
                      path="/manage-dishes"
                      element={user ? <ManageDishes /> : <Landing2 />}
                    />
                    <Route
                      path="/add-category"
                      element={user ? <AddCategory /> : <Landing2 />}
                    />
                    <Route
                      path="/add-asset"
                      element={user ? <AddAssetsPage /> : <Landing2 />}
                    />
                    <Route
                      path="/dishesPage"
                      element={user ? <DishPage /> : <Landing2 />}
                    />
                    <Route
                      path="/profile"
                      element={user ? <Profile /> : <Landing2 />}
                    />
                    <Route
                       path="/support"
                      element={user ? <SupportPage /> : <Landing2 />}
                    />
                    <Route
                      path="/ai-insights"
                      element={user ? <AIInsightsPage /> : <Navigate to="/auth" />}
                    />
                    <Route
                      path="/profile/edit"
                      element={user ? <EditProfile /> : <Landing2 />}
                    />
                  
                 
                    <Route path="/menu" element={<Menu />} />
                    <Route path="/termofservice" element={<TermsOfService />} />
                    <Route path="/accessibility" element={<Accessibility />} />

                    <Route
                      path="/request/resetpassword"
                      element={
                        user ? (
                          <Navigate to="/dashboard" />
                        ) : (
                          <SendLinkToEmail />
                        )
                      }
                    />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="/resetpassword" element={<ResetPassword />} />
                    {DESIGN_NUMBERS.map((designNumber) => {
                      const {Component} = DESIGNS[designNumber];
                      return (
                        <Route
                          key={designNumber}
                          path={`/design${designNumber}`}
                          element={<Component />}
                        />
                      );
                    })}
                    <Route
                      path="/design1/:categoryName/dishes/:userId/:categoryId"
                      element={<Design1Dish />}
                    />
                    <Route
                      path="/design4DishDetails"
                      element={<DishDetails />}
                    />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/payment-success" element={<SuccessPage />} />
                    <Route
                      path="/payment-failed"
                      element={
                        <div className="text-center p-20">
                          התשלום נכשל, נסה שוב.
                        </div>
                      }
                    />
                  </Routes>
                </AnimatePresence>
              </GlobalErrorBoundary>
            </main>
            {user && <Sidebar user={user} />}
          </div>

          {user && (
            <OnboardingTour
              user={user}
              onStatusChange={(updatedUser) => dispatch(setUser(updatedUser))}
            />
          )}

          <Footer />
        </ThemeProvider>
      </BrowserRouter>

      <ToastContainer position="top-right" autoClose={5000} theme="dark" />
    </div>
  );
}

export default App;
