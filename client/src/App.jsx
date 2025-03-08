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

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      dispatch(setUser(JSON.parse(savedUser)));
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
        {user && <Navbar />}
        <div className="flex-grow">
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
            <Route path="/designs" element={<Designs />} />

            <Route path="/add-dish" element={<AddDish />} />
            <Route path="/add-category" element={<AddCategory />} />
            <Route path="/add-asset" element={<AddAssetsPage />} />
            <Route path="/dishesPage" element={<DishPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/editDish" element={<EditDish />} />
            <Route path="/editCategory" element={<EditCategory />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/design1" element={<Design1 />} />
            <Route path="/design2" element={<Design2 />} />
            <Route
              path="/design1/:categoryName/dishes/:userId/:categoryId"
              element={<Design1Dish />}
            />
          </Routes>
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
