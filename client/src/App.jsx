import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import Signin from "./pages/Signin";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import Edit from "./pages/Edit";
import AddDish from "./components/AddDish";
import Dashboard from "./pages/Dashboard";
import AddCategory from "./components/AddCategory";
import DishPage from "./pages/DishPage";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "./state/user/userSlice";
import {
  getCategories,
  getAllDishesAndMapToCategories,
} from "@/utils/fetchData";
import Profile from "./pages/Profile";
import EditDish from "./pages/EditDish";
import Menu from "./pages/Menu";
import EditCategory from "./pages/EditCategory";
import Design1 from "./designs/Design1/Design1";
import Designs from "./pages/Designs";
import Design1Dish from "./designs/Design1/Design1Dish";
import Design2 from "./designs/Design2/Design2";
import AddAssetsPage from "./pages/AddAssetsPage";
import Landing2 from "./pages/Landing2";
import AdminPage from "./pages/AdminPage";
import { Analytics } from "@vercel/analytics/react";
import { setMenuCategories } from "./state/menu/menuCategoriesSlice";
import Design3 from "./designs/Design3/Design3";
import ScrollToTop from "./components/ScrollToTop";
import TermsOfService from "./pages/TermsOfService";
import Settings from "./pages/Settings";
import SendLinkToEmail from "./pages/SendLinkToEmail";
import Design4 from "./designs/Design4/Design4";
import { AnimatePresence } from "framer-motion";
import DishDetails from "./designs/Design4/Design4DishDetails";
import EditProfile from "./pages/EditProfile";
import ResetPassword from "./pages/ResetPassword";
import ManageCategories from "./pages/ManageCategories";
import ManageDishes from "./pages/ManageDishes";
import Sidebar from "./components/SideBar";
import SupportPage from "./pages/SupportPage";
import Design5 from "./designs/Design5/Design5";
import GlobalErrorBoundary from "./components/GlobalErrorBoundary";
import OnboardingTour from "./components/Dashboard/TourFix";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedCategories = localStorage.getItem("categories");

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      dispatch(setUser(parsedUser));
      
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
                categories
              );
              dispatch(setMenuCategories(categoriesWithDishes));
              localStorage.setItem(
                "categories",
                JSON.stringify(categoriesWithDishes)
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
              categories
            );
            dispatch(setMenuCategories(categoriesWithDishes));
            localStorage.setItem(
              "categories",
              JSON.stringify(categoriesWithDishes)
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
    <div className="flex flex-col min-h-screen">
      <BrowserRouter>
        <ScrollToTop />
        <Analytics />

        <div className="flex flex-grow overflow-hidden">
          <main className="flex-grow min-w-0 overflow-x-hidden">
            <GlobalErrorBoundary>
              <AnimatePresence mode="wait">
                <Routes>
                  <Route
                    path="/"
                    element={user ? <Navigate to="/dashboard" /> : <Landing2 />}
                  />
                  <Route
                    path="/dashboard"
                    element={user ? <Dashboard /> : <Navigate to="/signin" />}
                  />
                  <Route
                    path="/signin"
                    element={user ? <Navigate to="/dashboard" /> : <Signin />}
                  />
                  <Route
                    path="/signup"
                    element={user ? <Navigate to="/dashboard" /> : <Signup />}
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
                  <Route path="/edit" element={<Edit />} />
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
                    path="/profile/edit"
                    element={user ? <EditProfile /> : <Landing2 />}
                  />
                  <Route
                    path="/editDish"
                    element={user ? <EditDish /> : <Landing2 />}
                  />
                  <Route
                    path="/editCategory"
                    element={user ? <EditCategory /> : <Landing2 />}
                  />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/termofservice" element={<TermsOfService />} />
                  <Route
                    path="/request/resetpassword"
                    element={
                      user ? <Navigate to="/dashboard" /> : <SendLinkToEmail />
                    }
                  />
                  <Route path="/resetpassword" element={<ResetPassword />} />
                  <Route path="/design1" element={<Design1 />} />
                  <Route path="/design2" element={<Design2 />} />
                  <Route path="/design3" element={<Design3 />} />
                  <Route
                    path="/design1/:categoryName/dishes/:userId/:categoryId"
                    element={<Design1Dish />}
                  />
                  <Route path="/design4" element={<Design4 />} />
                  <Route path="/design4DishDetails" element={<DishDetails />} />
                  <Route path="/design5" element={<Design5 />} />
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
      </BrowserRouter>

      <ToastContainer position="top-right" autoClose={5000} theme="dark" />
    </div>
  );
}

export default App;
