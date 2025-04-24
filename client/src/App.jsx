import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/nav/Navbar";
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

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  // const menuCategories = useSelector((state) => state.menuCategories);
  // TODO: export the logic to different files (useEffect+isTokenExpired) to make the code more readable (Custom Hook or something similar)

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedCategories = localStorage.getItem("categories");

    if (savedUser) {
      dispatch(setUser(JSON.parse(savedUser)));
    }
    if (savedCategories) {
      dispatch(setMenuCategories(JSON.parse(savedCategories)));
    }
  }, [dispatch]);

  const isTokenExpired = () => {
    const expirationTime = localStorage.getItem("expireTime");
    return expirationTime && Date.now() > Number(expirationTime);
  };
  if (isTokenExpired()) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("expireTime");
    window.location.reload();

    return;
  }
  return (
    <div className="flex flex-col min-h-[100svh]">
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <ScrollToTop />
        <Analytics />
        {user && <Navbar />}
        <div className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes>
              <Route
                path="/"
                element={user ? <Navigate to="/dashboard" /> : <Landing2 />}
              />

              {/* Protect Dashboard route for logged-in users only */}
              <Route
                path="/dashboard"
                element={user ? <Dashboard /> : <Navigate to="/signin" />}
              />

              {/* Protect Signin route - redirect logged-in users to Dashboard */}
              <Route
                path="/signin"
                element={user ? <Navigate to="/dashboard" /> : <Signin />}
              />

              {/* Protect Signup route - redirect logged-in users to Dashboard */}
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
                path="/account/password/reset"
                element={
                  user ? <Navigate to="/dashboard" /> : <SendLinkToEmail />
                }
              />

              <Route path="/design1" element={<Design1 />} />
              <Route path="/design2" element={<Design2 />} />
              <Route path="/design3" element={<Design3 />} />
              <Route
                path="/design1/:categoryName/dishes/:userId/:categoryId"
                element={<Design1Dish />}
              />
              <Route path="/design4" element={<Design4 />} />
              <Route path="/design4DishDetails" element={<DishDetails />} />
            </Routes>
          </AnimatePresence>
        </div>

        <div className=" z-50">
          <Footer />
        </div>
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={5000} theme="dark" />
    </div>
  );
}

export default App;
