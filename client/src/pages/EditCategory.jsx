import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { useSelector } from "react-redux";
import axios from "axios";

const EditCategory = () => {
  const location = useLocation();
  const [img, setImg] = useState(null);
  const [name, setName] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.user.user);
  const { item } = location.state || {};
  const category = item;
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("newName", name);
    if (img) {
      formData.append("img", img);
    }
    try {
      await axios.put(
        `http://localhost:8000/api/category/updateCategory/${user._id}/${category._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };
  return (
    <div className="px-4 sm:px-6 lg:px-8">
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

            <img
              src={item?.img}
              width={200}
              height={250}
              alt=""
              className="rounded mt-5 max-w-full lg:max-w-[400px] lg:max-h-[500px]"
            />
          </div>

          <div className="w-full lg:w-60">
            <label
              htmlFor="dishName"
              className="block text-lg font-medium leading-6 text-end text-gray-900"
            >
              שם הקטגוריה
            </label>
            <div className="mt-2">
              <input
                onChange={(e) => setName(e.target.value)}
                id="categoryNameName"
                name="categoryName"
                type="text"
                placeholder={item?.name || ""}
                autoComplete="categoryName-name"
                className="block text-end w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-500 sm:text-sm sm:leading-6"
              />
            </div>
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
              item={category}
              type={false}
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default EditCategory;
