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
import ResetPassword from "./pages/ResetPassword";
import ManageCategories from "./pages/ManageCategories";
import ManageDishes from "./pages/ManageDishes";
import Sidebar from "./components/SideBar";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

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
    <div className="flex flex-col min-h-screen">
      <BrowserRouter>
        <ScrollToTop />
        <Analytics />

        <div className="flex flex-grow">
          <main className="flex-grow">
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
              </Routes>
            </AnimatePresence>
          </main>
          {user && <Sidebar user={user} />}
        </div>

        <Footer />
      </BrowserRouter>

      <ToastContainer position="top-right" autoClose={5000} theme="dark" />
    </div>
  );
}

export default App;
