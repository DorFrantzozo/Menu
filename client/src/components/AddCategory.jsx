import { useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";

import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/baseUrl";

export default function AddCategory() {
  const user = useSelector((state) => state.user.user);
  const [name, setName] = useState("");
  const [locationNumber, setLocationNumber] = useState(0);
  const [img, setImg] = useState(null); // Handle image file
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create a FormData object to send the image file and other fields
    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("name", name);
    formData.append("locationNumber", locationNumber);
    if (img) {
      formData.append("img", img); // Append the image file to formData
    }

    try {
      const response = await axiosInstance.post(
        `/category/createCategory/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Specify multipart/form-data for file uploads
          },
        }
      );
      console.log("Category created successfully:", response.data);
      toast.success("Category created successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating category:", error);
      // Check if the error has a response message or use the default message
      const errorMessage =
        error.response?.data?.message || error.message || "An error occurred";
      toast.error(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center">
      <div className="space-y-12 w-400 mt-10 border rounded p-2 bg-stone-100">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="font-semibold leading-7 text-black flex justify-center text-2xl">
            קטגוריה חדשה
          </h2>

          <div dir="rtl">
            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-12">
              <div className="sm:col-span-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-black-400"
                >
                  שם הקטגוריה
                </label>
                <div className="mt-2">
                  <input
                    name="name"
                    type="text"
                    required
                    className="block flex-1 border-1  border-slate-600 bg-transparent py-1.5 pl-1 text-gray-900  rounded placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6 focus-within:ring-green-200"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="w-full mt-8">
              <label
                htmlFor="desciption"
                className="block text-sm font-medium leading-6 text-black-400"
              >
                תיאור הקטגוריה
              </label>
              <span className="text-[13px]"> * אופציונלי </span>
              <div className="mt-2 w-[full]">
                <textarea
                  name="name"
                  type="text"
                  required
                  className="  border-1 w-[80%]  border-slate-600 bg-transparent py-1.5 pl-1 text-gray-900  rounded placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6 focus-within:ring-green-200"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-12">
              <div className="sm:col-span-4">
                <label
                  htmlFor="locationNumber"
                  className="block text-sm font-medium leading-6 text-black-400"
                >
                  מספר מיקום
                </label>
                <span className="text-xs">
                  * ייצג את סדר הופעת הקטגוריה בתפריט <br />( מתחיל מ - 0)
                  {"  "}
                </span>
                <div className="mt-2">
                  <input
                    name="locationNumber"
                    type="text"
                    placeholder="0"
                    required
                    className="block flex-1 border-1  border-slate-600 bg-transparent py-1.5 pl-1 text-gray-900  rounded placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6 focus-within:ring-green-200"
                    value={locationNumber}
                    onChange={(e) => setLocationNumber(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="col-span-full mt-10">
              <label
                htmlFor="img"
                className="block text-sm font-medium leading-6 text-black"
              >
                תמונה
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-slate-600  px-6 py-10 bg-white">
                <div className="text-center">
                  <PhotoIcon
                    aria-hidden="true"
                    className="mx-auto h-12 w-12 text-gray-300"
                  />
                  {img && (
                    <p className="mt-2 text-sm text-green-400">
                      Selected file: {img.name}
                    </p>
                  )}
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-black w-[100px] font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-green-400 focus-within:ring-offset-2 hover:text-green-400"
                    >
                      <span>העלה תמונה</span>
                      <input
                        id="file-upload"
                        name="img"
                        type="file"
                        className="sr-only"
                        onChange={(e) => setImg(e.target.files[0])} // Set the file to state
                      />
                    </label>
                    <p className="pl-1 text-black ms-2">או גרור למסגרת</p>
                  </div>

                  <p className="text-xs leading-5 text-black">
                    PNG, JPG, GIF עד 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6 ">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="text-sm font-semibold leading-6 text-black"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}
