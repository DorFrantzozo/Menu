import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import axiosInstance from "../utils/baseUrl";

export default function DropDown({ setCategory }) {
  const user = useSelector((state) => state.user.user);
  const [categories, setCategories] = useState([]);
  const [dropTitle, setDropTitle] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.post(
          "/category/getCategories",
          { userId: user._id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [user]);

  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
        {dropTitle ? dropTitle : "Categories"}
        <ChevronDownIcon
          aria-hidden="true"
          className="-mr-1 h-5 w-5 text-gray-400"
        />
      </MenuButton>

      <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="py-1">
          {categories.length > 0 ? (
            categories.map((category) => (
              <MenuItem key={category._id}>
                {(active) => (
                  <button
                    onClick={() => {
                      setCategory(category._id); // First function
                      setDropTitle(category.name); // Second function
                    }}
                    className={`${
                      active
                        ? "bg-white text-center text-gray-900 hover:bg-slate-100"
                        : "text-gray-700"
                    } block px-4 py-2 text-sm w-full text-left`}
                  >
                    {category.name}
                    <hr className=" w-3/4 mx-auto" />
                  </button>
                )}
              </MenuItem>
            ))
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">
              No categories available
            </div>
          )}
        </div>
      </MenuItems>
    </Menu>
  );
}

DropDown.propTypes = {
  setCategory: PropTypes.func.isRequired, // Ensure setCategory is passed and is a function
};
