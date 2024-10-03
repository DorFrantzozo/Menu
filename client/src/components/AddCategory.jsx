import { useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function AddCategory() {
  const user = useSelector((state) => state.user.user);
  const [name, setName] = useState("");
  const [img, setImg] = useState(null); // Handle image file
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create a FormData object to send the image file and other fields
    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("name", name);
    if (img) {
      formData.append("img", img); // Append the image file to formData
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/api/category/createCategory/`,
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
      toast.error("Failed to create category");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center">
      <div className="space-y-12 w-400 mt-10 border rounded p-2">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="font-semibold leading-7 text-white flex justify-center text-2xl">
            New Category
          </h2>

          <div>
            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-12">
              <div className="sm:col-span-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-green-400"
                >
                  Category Name
                </label>
                <div className="mt-2">
                  <input
                    name="name"
                    type="text"
                    required
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 bg-white rounded placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6 focus-within:ring-green-600"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="col-span-full mt-10">
              <label
                htmlFor="img"
                className="block text-sm font-medium leading-6 text-green-400"
              >
                Photo
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-green-400 px-6 py-10 bg-white">
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
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="img"
                        type="file"
                        className="sr-only"
                        onChange={(e) => setImg(e.target.files[0])} // Set the file to state
                      />
                    </label>
                    <p className="pl-1 text-black">or drag and drop</p>
                  </div>

                  <p className="text-xs leading-5 text-black">
                    PNG, JPG, GIF up to 10MB
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
            className="text-sm font-semibold leading-6 text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}
