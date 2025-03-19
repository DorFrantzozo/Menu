import { useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import DropDown from "./DropDown";
import axiosInstance from "../utils/baseUrl";
import Spinner from "./Spinner";
import {
  getCategories,
  getAllDishesAndMapToCategories,
} from "@/utils/fetchData";
import { setMenuCategories } from "@/state/menu/menuCategoriesSlice";

export default function AddDish() {
  const user = useSelector((state) => state.user.user);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [img, setImg] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [pregnant, setPregnant] = useState(false);
  const [gluten, setGluten] = useState(false);
  const [lactose, setLactose] = useState(false);
  const [vegi, setVegi] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("name", name);
    formData.append("img", img);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("pregnant", pregnant);
    formData.append("gluten", gluten);
    formData.append("vegi", vegi);
    formData.append("lactose", lactose);

    try {
      setIsLoading(true);
      await axiosInstance.post(`/dish/createDish/${user._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const categories = await getCategories(user);
      const categoriesWithDishes = await getAllDishesAndMapToCategories(
        user,
        categories
      );
      dispatch(setMenuCategories(categoriesWithDishes));
      localStorage.setItem("categories", JSON.stringify(categoriesWithDishes));

      setIsLoading(false);
      toast.success("Dish created successfully");

      navigate("/dashboard");
    } catch (error) {
      setIsLoading(false);
      toast.error("Error creating dish:", error);
      toast.error(error.response?.data?.message || "Error creating dish");
    }
  };

  return (
    <>
      {isLoading && (
        <div className="absolute pt-20 top-0 w-full h-full flex justify-center bg-zinc-800/50 z-50">
          <Spinner />
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex justify-center">
        <div
          dir="rtl"
          className="space-y-12 mb-10 w-400 mt-10 border rounded-xl p-2 shadow bg-stone-100"
        >
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="font-semibold leading-7 text-black flex justify-center text-2xl">
              מנה חדשה
            </h2>

            <div>
              <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-12">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-6 text-lack"
                  >
                    שם המנה
                  </label>
                  <div className="mt-2">
                    <input
                      name="name"
                      type="text"
                      required
                      className="block w-60 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus-within:ring-slate-600 sm:text-sm sm:leading-6"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium leading-6 text-black"
                  >
                    מחיר
                  </label>
                  <div className="mt-2">
                    <input
                      id="price"
                      name="price"
                      rows={3}
                      className="block w-20 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus-within:ring-slate-600  sm:text-sm sm:leading-6"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-span-2 mt-8">
                  <DropDown setCategory={setCategory} />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium leading-6 text-black mt-4"
                >
                  אודות המנה
                </label>
                <div className="mt-2">
                  <textarea
                    required
                    id="description"
                    name="description"
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus-within:ring-slate-600  sm:text-sm sm:leading-6"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-black">
                  תיאור מרכיבי המנה
                </p>
              </div>

              <div className="col-span-full">
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
                      <p className="mt-2 text-sm text-black">
                        Selected file: {img.name} {/* Display file name */}
                      </p>
                    )}
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-black w-[100px] font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-slate-600  focus-within:ring-offset-2 hover:text-green-400"
                      >
                        <span className="p-2">העלה תמונה</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={(e) => setImg(e.target.files[0])} // Assuming you're handling image file upload here
                        />
                      </label>
                      <p className="pl-1 ms-2 text-black">או גרור למסגרת</p>
                    </div>

                    <p className="text-xs leading-5 text-black">
                      PNG, JPG, GIF עד 10MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-black">
              אלרגיות ורגישיות
            </h2>
            <p>* סימון ב וי מעיד על התאמה לרגישות המסומנת</p>

            <div className="mt-10 space-y-10">
              <fieldset>
                <div className="mt-6 space-y-6">
                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input
                        id="gluten"
                        name="gluten"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-black focus:ring-green-400"
                        checked={gluten}
                        onChange={(e) => setGluten(e.target.checked)}
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label htmlFor="gluten" className="text-black text-xl">
                        מתאים לאלרגיית גלוטן
                      </label>
                    </div>
                  </div>
                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input
                        id="pregnant"
                        name="pregnant"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-black focus:ring-green-400"
                        checked={pregnant}
                        onChange={(e) => setPregnant(e.target.checked)}
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label htmlFor="pregnant" className="text-xl text-black">
                        מתאים להריוניות
                      </label>
                    </div>
                  </div>

                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input
                        id="lactose"
                        name="lactose"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-black focus:ring-green-400"
                        checked={lactose}
                        onChange={(e) => setLactose(e.target.checked)}
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label htmlFor="lactose" className="text-xl text-black">
                        מתאים לרגישות ללקטוז
                      </label>
                    </div>
                  </div>

                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input
                        id="vegi"
                        name="vegi"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-black focus:ring-green-400"
                        checked={vegi}
                        onChange={(e) => setVegi(e.target.checked)}
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label htmlFor="vegi" className="text-xl text-black">
                        מתאים לצמחונים / טבעונים
                      </label>
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              ביטול
            </button>
            <button
              type="submit"
              className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            >
              שמירה
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
