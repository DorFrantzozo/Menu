import { useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import FileTypeDropDown from "../components/FileTypeDropDown";

export default function AddAssetPage() {
  const user = useSelector((state) => state.user.user);
  const [fileName, setFileName] = useState("");
  const [type, setType] = useState(""); // This should be set from the dropdown
  const [img, setImg] = useState(null); // Handle image file
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!fileName) {
      return toast.error("שדה שם קובץ חייב להיות מלא");
    }

    if (!type) {
      return toast.error("שדה סוג קובץ חייב להיות מלא");
    }

    const formData = new FormData();
    formData.append("fileName", fileName);
    formData.append("type", type);
    formData.append("img", img);

    try {
      const response = await axios.post(
        `http://localhost:8000/api/asset/uploadAsset/${user._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Specify multipart/form-data for file uploads
          },
        }
      );
      console.log("image uploaded successfully:", response.data);
      toast.success("תמונה הועלתה בהצלחה");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating asset:", error);
      // Check if the error has a response message or use the default message
      const errorMessage =
        error.response?.data?.message || error.message || "An error occurred";
      toast.error(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center">
      <div className="space-y-12 mt-10 w-[70%] p-2">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="font-semibold leading-7 text-black flex justify-center text-2xl">
            הוסף תמונה
          </h2>

          <div>
            <div className="mt-10 flex justify-end">
              <div className="sm:col-span-4">
                <label
                  htmlFor="fileName"
                  className="flex justify-end text-sm font-medium leading-6 text-black-400"
                >
                  שם קובץ
                </label>
                <div className="mt-2">
                  <input
                    name="fileName"
                    type="text"
                    required
                    className="block flex-1 border-1 border-slate-600 bg-transparent py-1.5 pr-1 text-gray-900 rounded placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6 focus-within:ring-green-200"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-end">
              <div className="sm:col-span-4">
                <label
                  htmlFor="type"
                  className="flex justify-end text-sm font-medium leading-6 text-black-400"
                >
                  סוג קובץ
                </label>

                <div className="mt-2">
                  <FileTypeDropDown
                    setType={setType}
                    name="type"
                    type="text"
                    placeholder="בחר סוג"
                    required
                    className="block flex-1 border-1 border-slate-600 bg-transparent py-1.5 pr-1 text-gray-900 rounded placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6 focus-within:ring-green-200"

                    // Ensure type is set correctly
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
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-slate-600 px-6 py-10 bg-white">
                <div className="text-center">
                  <PhotoIcon
                    aria-hidden="true"
                    className="mx-auto h-12 w-12 text-gray-300"
                  />
                  {img && (
                    <p className="mt-2 text-sm text-green-400">
                      קובץ שנבחר: {img.name}
                    </p>
                  )}
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <p className="pr-1 text-black">או גרור והשאר</p>
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-black w-[100px] font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-green-400 focus-within:ring-offset-2 hover:text-green-400"
                    >
                      <span>העלאת קובץ</span>
                      <input
                        id="file-upload"
                        name="img"
                        type="file"
                        className="sr-only"
                        onChange={(e) => setImg(e.target.files[0])} // Set the file to state
                      />
                    </label>
                  </div>

                  <p className="text-xs leading-5 text-black">
                    PNG, JPG, GIF עד 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-start gap-x-6">
          <button
            type="submit"
            className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            שמור
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="text-sm font-semibold leading-6 text-black"
          >
            ביטול
          </button>
        </div>
      </div>
    </form>
  );
}
