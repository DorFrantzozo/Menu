import { useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useSelector } from "react-redux";
import DropDown from "./DropDown";

export default function AddDish() {
  const user = useSelector((state) => state.user.user);
  // State variables for form inputs
  const [name, setName] = useState("");
  const [img, setImg] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [pregnant, setPregnant] = useState(false);
  const [gluten, setGluten] = useState(false);
  const [lactose, setLactose] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    try {
      const response = await axios.post(
        `http://localhost:8000/api/dish/createDish/${user.userId}`, // Ensure userId is correctly appended
        {
          name,
          img,
          description,
          price,
          category,
          pregnant,
          gluten,
          lactose,
        }
      );
      console.log("Dish created successfully:", response.data);
    } catch (error) {
      console.error("Error creating dish:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center">
      <div className="space-y-12 w-400 mt-10 border rounded p-2">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="font-semibold leading-7 text-white flex justify-center text-2xl">
            New Dish
          </h2>

          <div>
            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-12">
              <div className="sm:col-span-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-green-400"
                >
                  Dish Name
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
              <div className="col-span-2">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium leading-6 text-green-400"
                >
                  Price
                </label>
                <div className="mt-2">
                  <input
                    id="price"
                    name="price"
                    rows={3}
                    className="block w-20 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus-within:ring-green-600 sm:text-sm sm:leading-6"
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
                className="block text-sm font-medium leading-6 text-green-400"
              >
                About
              </label>
              <div className="mt-2">
                <input
                  id="description"
                  name="description"
                  rows={3}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus-within:ring-green-600 sm:text-sm sm:leading-6"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-white">
                Write the ingredients of the dish
              </p>
            </div>

            <div className="col-span-full">
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
                        name="file-upload"
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
            </div>
          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-green-400">
            Allergies and sensitivities
          </h2>

          <div className="mt-10 space-y-10">
            <fieldset>
              <div className="mt-6 space-y-6">
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="gluten"
                      name="gluten"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-green-500 focus:ring-green-400"
                      checked={gluten}
                      onChange={(e) => setGluten(e.target.checked)}
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label htmlFor="gluten" className="text-white text-xl">
                      Gluten
                    </label>
                  </div>
                </div>
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="pregnant"
                      name="pregnant"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-green-500 focus:ring-green-400"
                      checked={pregnant}
                      onChange={(e) => setPregnant(e.target.checked)}
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label htmlFor="pregnant" className="text-xl text-white">
                      Pregnant
                    </label>
                  </div>
                </div>

                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="lactose"
                      name="lactose"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-green-500 focus:ring-green-400"
                      checked={lactose}
                      onChange={(e) => setLactose(e.target.checked)}
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label htmlFor="lactose" className="text-xl text-white">
                      Lactose
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
