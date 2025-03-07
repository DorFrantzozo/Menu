import { useState } from "react";

import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../state/user/userSlice";
import { PhotoIcon } from "@heroicons/react/24/solid";
import logo from "../assets/img/logoBlack.png";
import axiosInstance from "../utils/baseUrl";
const Signup = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [img, setImg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("email", email);
    formData.append("restaurantName", restaurantName);
    formData.append("password", password);
    formData.append("logo", img);

    try {
      const response = await axiosInstance.post("/user/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        const { user, token } = response.data;
        dispatch(setUser(user));
        dispatch(setToken(token));
        localStorage.setItem("token", token);
        toast.success("משתמש נוצר בהצלחה");
        navigate("/home");
      }
    } catch (error) {
      console.error(
        "Error creating user:",
        error.response?.data || error.message
      );
      toast.error("Failed to create user");
    }
  };
  return (
    <div>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src={logo}
            className="h-[180px] w-[290px]  mx-auto"
          />
          <h2 className="text-center text-black text-2xl  leading-9 tracking-tight ">
            Create Your Account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} method="POST" className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-black"
              >
                Resturant Name
              </label>
              <div className="mt-2">
                <input
                  onChange={(e) => setRestaurantName(e.target.value)}
                  id="name"
                  name="name"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-400 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
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
                  className="block text-sm font-medium leading-6  text-black"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full  rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-400 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-green-400 px-6 py-10 bg-white">
              <div className="text-center">
                <PhotoIcon
                  aria-hidden="true"
                  className="mx-auto h-12 w-12 text-gray-300"
                />
                {img && (
                  <p className="mt-2 text-sm text-green-400">
                    Selected file: {img.name} {/* Display file name */}
                  </p>
                )}
                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-black w-[100px] font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-green-400 focus-within:ring-offset-2 hover:text-green-400"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="logo"
                      type="file"
                      className="sr-only"
                      onChange={(e) => setImg(e.target.files[0])} // Assuming you're handling image file upload here
                    />
                  </label>
                  <p className="pl-1 text-black">or drag and drop</p>
                </div>

                <p className="text-xs leading-5 text-black">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-green-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm   hover:text-black    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign up
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Alreay a member?{" "}
            <button
              onClick={() => navigate("/signin")}
              className="font-semibold leading-6 text-green-400 hover:text-black"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
