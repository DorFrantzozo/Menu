import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setUser, setToken } from "../state/user/userSlice";
import {
  getCategories,
  getAllDishesAndMapToCategories,
} from "@/utils/fetchData";
import { setMenuCategories } from "@/state/menu/menuCategoriesSlice";

import logo from "../assets/img/logoBlack.png";
import axiosInstance from "../utils/baseUrl";
const Signin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axiosInstance.post("/user/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const { user, token, expireTime } = response.data;

        dispatch(setUser(user));
        dispatch(setToken(token));
        localStorage.setItem("token", token);
        localStorage.setItem("expireTime", expireTime);
        localStorage.setItem("user", JSON.stringify(user));

        const categories = await getCategories(user);
        // Get categories with their dishes
        const categoriesWithDishes = await getAllDishesAndMapToCategories(
          user,
          categories,
          dispatch
        );

         dispatch(setMenuCategories(categoriesWithDishes));
        localStorage.setItem(
          "categories",
          JSON.stringify(categoriesWithDishes)
        );

        toast.success("התחברות בהצלחה");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("שם המשתמש או הסיסמה אינם תקינים");
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6  lg:px-8  ">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Menu Logo"
            src={logo}
            className="h-[180px] w-[290px]  mx-auto"
          />
          <h2 className="text-center text-2xl leading-9 tracking-tight text-black">
            התחברות לחשבון
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            action="#"
            onSubmit={handleSubmit}
            method="POST"
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-black"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email} //TODO:remove
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-400 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-black"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-black hover:text-green-400"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password} // TODO:remove
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-400 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-green-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm   hover:text-black    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                התחבר
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            <button
              onClick={() => navigate("/signup")}
              className="font-semibold leading-6 text-green-400 hover:text-black mb-10"
            >
              הרשמה
            </button>
            {"   "} ?אין לך חשבון
          </p>
        </div>
      </div>
    </>
  );
};

export default Signin;
