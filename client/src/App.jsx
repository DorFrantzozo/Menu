import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Landing";
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

function App() {
  const user = useSelector((state) => state.user.user);

  return (
    <div className="flex flex-col min-h-screen">
      <BrowserRouter>
        {user && <Navbar />}

        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/home"
            element={user ? <Home /> : <Navigate to="/" />}
          />{" "}
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/edit" element={<Edit />} />
          <Route path="/add-dish" element={<AddDish />} />
          <Route path="/add-category" element={<AddCategory />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dishesPage" element={<DishPage />} />
        </Routes>

        <Footer />
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={5000} theme="dark" />
    </div>
  );
}

export default App;
