import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

const EditCategory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const token = localStorage.getItem("token");

  // ודא שה-item לא undefined
  const item = location.state?.item || {};

  const [img, setImg] = useState(null);
  const [name, setName] = useState(item.name || "");
  const [locationNumber, setLocationNumber] = useState(
    item.locationNumber || 0
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("newName", name);
    formData.append("locationNumber", locationNumber || item.locationNumber);

    if (img) {
      formData.append("img", img);
    }

    try {
      await axios.put(
        `http://localhost:8000/api/category/updateCategory/${user._id}/${item._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/dashboard");
      toast.success("קטגוריה שונתה בהצלחה");
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error(error.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="px-4 sm:px-6 lg:px-8 lg:h-[80vh] mt-20 ">
          <h1 className="text-black flex justify-center text-2xl mt-10">
            {item?.name} עריכה
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <div className="flex flex-col lg:flex-row justify-center mt-10 space-y-6 lg:space-y-0 lg:space-x-6">
              <div className="w-full lg:w-auto flex flex-col items-center">
                <input
                  type="file"
                  accept="image/*"
                  id="file-input"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setImg(file);
                    }
                  }}
                />
                <label
                  htmlFor="file-input"
                  className="bg-slate-100 rounded p-2 cursor-pointer"
                >
                  שנה תמונה
                </label>

                {item?.img && (
                  <img
                    src={item.img}
                    width={200}
                    height={250}
                    alt=""
                    className="rounded mt-5 max-w-full lg:max-w-[400px] lg:max-h-[500px]"
                  />
                )}
              </div>

              <div className="w-full lg:w-60">
                <label
                  htmlFor="categoryName"
                  className="block text-lg font-medium leading-6 text-end text-gray-900"
                >
                  שם הקטגוריה
                </label>
                <div className="mt-2">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    id="categoryName"
                    name="categoryName"
                    type="text"
                    placeholder="שם הקטגוריה"
                    className="block text-end w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>

            <div className="w-full lg:w-40 lg:ms-80 ">
              <label
                htmlFor="locationNumber"
                className="block text-lg font-medium leading-6 text-end text-gray-900"
              >
                מיקום בתפריט
              </label>
              <div className="mt-2">
                <input
                  value={locationNumber}
                  onChange={(e) => setLocationNumber(e.target.value)}
                  id="locationNumber"
                  name="locationNumber"
                  type="text"
                  placeholder="מיקום בתפריט"
                  className="block text-end w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <hr className="mt-10 w-full" />

            <div className="flex">
              <button
                type="submit"
                className="mt-10 m-10 bg-slate-100 rounded p-2 cursor-pointer"
              >
                שמור
              </button>
              <button
                type="button"
                className="mt-10 m-10 bg-red-500 rounded p-2 cursor-pointer text-white"
                onClick={() => setIsOpen(true)}
              >
                מחק קטגוריה
              </button>
              {isOpen && (
                <Modal
                  open={isOpen}
                  setOpen={setIsOpen}
                  user={user}
                  item={item}
                  type={false}
                />
              )}
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default EditCategory;
