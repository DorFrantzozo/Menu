import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/nav/Navbar";
import Signup from "./pages/Signup";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import Signin from "./pages/Signin";
import Landing from "./pages/Landing";
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

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      dispatch(setUser(JSON.parse(savedUser)));
    }
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <BrowserRouter>
        {user && <Navbar />}

        <Routes>
          <Route path="/menu" element={<Menu />} />
          {/* Redirect logged-in users from Landing page to Dashboard */}
          <Route
            path="/"
            element={user ? <Navigate to="/dashboard" /> : <Landing />}
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

          <Route path="/edit" element={<Edit />} />
          <Route path="/add-dish" element={<AddDish />} />
          <Route path="/add-category" element={<AddCategory />} />
          <Route path="/dishesPage" element={<DishPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/editDish" element={<EditDish />} />
        </Routes>

        <div className="mt-auto z-50">
          <Footer />
        </div>
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={5000} theme="dark" />
    </div>
  );
}

export default App;
