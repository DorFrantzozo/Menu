import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import Modal from "../components/Modal";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import axiosInstance from "../utils/baseUrl";
const EditDish = () => {
  const user = useSelector((state) => state.user.user);

  const location = useLocation();
  const { item } = location.state || {};
  const dish = item?.item;
  const token = localStorage.getItem("token");

  // Initialize state based on dish properties
  const [dishName, setDishName] = useState(dish?.name || "");
  const [description, setDescription] = useState(dish?.description || "");
  const [price, setPrice] = useState(dish?.price || "");
  const [img, setImg] = useState(null);
  const [gluten, setGluten] = useState(dish?.gluten || false);
  const [pregnant, setPregnant] = useState(dish?.pregnant || false);
  const [lactose, setLactose] = useState(dish?.lactose || false);
  const [vegi, setVegi] = useState(dish?.vegi || false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (dish) {
  //     setGluten(dish.gluten);
  //     setPregnant(dish.pregnant);
  //     setLactose(dish.lactose);
  //     setVegi(dish.vegi);
  //   }
  // }, [dish]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", dishName);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("gluten", gluten);
    formData.append("pregnant", pregnant);
    formData.append("lactose", lactose);
    formData.append("vegi", vegi);
    formData.append("category", dish.category);

    if (img) {
      formData.append("img", img);
    }

    try {
      const response = await axiosInstance.put(
        `/dish/updateDish/${user._id}/${dish._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      navigate("/dashboard");
      toast.success("השינויים נשמרו בהצלחה");
    } catch (error) {
      console.error("Error updating dish:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Spinner loading={isLoading} />
      ) : (
        <div className="px-4 sm:px-6 lg:px-8 ">
          <h1 className="text-black flex justify-center text-2xl mt-10">
            {dish?.name} עריכה
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
                  src={dish?.img}
                  width={200}
                  height={250}
                  alt=""
                  className="rounded mt-5 max-w-full lg:max-w-[400px] lg:max-h-[500px]"
                />
              </div>

              <div className="w-full lg:w-60 flex flex-col">
                <label
                  htmlFor="price"
                  className="block text-lg font-medium leading-6 text-end text-gray-900"
                >
                  מחיר
                </label>
                <div className="mt-2">
                  <input
                    onChange={(e) => setPrice(e.target.value)}
                    id="price"
                    name="price"
                    type="text"
                    placeholder={dish?.price + " ₪" || ""}
                    autoComplete="price"
                    className="block text-end w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="w-full lg:w-60">
                <label
                  htmlFor="dishName"
                  className="block text-lg font-medium leading-6 text-end text-gray-900"
                >
                  שם המנה
                </label>
                <div className="mt-2">
                  <input
                    onChange={(e) => setDishName(e.target.value)}
                    id="dishName"
                    name="dishName"
                    type="text"
                    placeholder={dish?.name || ""}
                    autoComplete="restaurant-name"
                    className="block text-end w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>

            <hr className="mt-10 w-full" />

            <div className="flex flex-col items-center mt-10 space-y-6">
              <div className="w-full lg:w-[80%]">
                <label
                  htmlFor="dishDescription"
                  className="block text-lg font-medium leading-6 text-end lg:-me-40 text-gray-900"
                >
                  תיאור
                </label>
                <p className="text-sm text-end lg:-me-40">תיאור המנה </p>
                <p className="text-sm text-end lg:-me-40">{dish.description}</p>
                <div className="mt-2 w-full sm:w-[600px] md:w-[700px] lg:w-[850px]">
                  <textarea
                    onChange={(e) => setDescription(e.target.value)}
                    id="dishDescription"
                    name="dishDescription"
                    placeholder="תיאור"
                    autoComplete="dishDescription"
                    className="block text-end w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-500 sm:text-sm sm:leading-6 min-h-[100px] sm:min-h-[150px] lg:min-h-[100px] max-h-[400px] resize-y"
                  />
                </div>
              </div>
            </div>
            <div className="mt-10 w-[40%]  space-y-4 mx-auto">
              {[
                {
                  label: "מתאים  גלוטן",
                  checked: gluten,
                  setChecked: setGluten,
                },
                {
                  label: "מתאים להריון",
                  checked: pregnant,
                  setChecked: setPregnant,
                },
                {
                  label: "מתאים ללקטוז",
                  checked: lactose,
                  setChecked: setLactose,
                },
                { label: "מתאים לצמחונים", checked: vegi, setChecked: setVegi },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-center lg:justify-end space-x-2 rtl:space-x-reverse"
                >
                  <label className="text-gray-700 font-medium text-end">
                    {item.label}
                  </label>
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => item.setChecked(!item.checked)}
                    className="hidden peer"
                  />
                  <span
                    className={`w-5 h-5 border-2 rounded-full transition-all duration-200 flex items-center justify-center ${
                      item.checked
                        ? "bg-black border-black"
                        : "bg-white border-gray-400"
                    } cursor-pointer`}
                    onClick={() => item.setChecked(!item.checked)}
                  >
                    {item.checked && (
                      <CheckIcon className="w-4 h-4 text-white" />
                    )}
                  </span>
                </div>
              ))}
            </div>

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
                מחק מנה
              </button>
              {isOpen && (
                <Modal
                  open={isOpen}
                  setOpen={setIsOpen}
                  user={user}
                  item={dish}
                  type={true}
                />
              )}
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default EditDish;
