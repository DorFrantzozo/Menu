import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import PropTypes from "prop-types";

import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/baseUrl";
import { useDispatch } from "react-redux";
import {
  setMenuCategories,
  updateMenuCategories,
} from "@/state/menu/menuCategoriesSlice";
import {
  getAllDishesAndMapToCategories,
  getCategories,
} from "@/utils/fetchData";
import Spinner from "./Spinner";
import { useState } from "react";

export default function Modal({ open, setOpen, user, item, type }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    setLoading(true);
    try {
      if (type === true) {
        await axiosInstance.delete(`/dish/deleteDish/${user._id}/${item._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const categories = await getCategories(user);
        const categoriesWithDishes = await getAllDishesAndMapToCategories(
          user,
          categories
        );
        dispatch(setMenuCategories(categoriesWithDishes));
      } else {
        await axiosInstance.delete(
          `/category/deleteCategory/${user._id}/${item._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const updatedCategories = await getCategories(user);
        dispatch(updateMenuCategories(updatedCategories));
      }
      setOpen(false);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      className="relative z-50"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />
      <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="flex flex-col sm:flex-row items-center sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <ExclamationTriangleIcon
                    aria-hidden="true"
                    className="h-6 w-6 text-red-600"
                  />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-right w-full">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold leading-6 text-gray-900 text-right"
                  >
                    אזהרת מחיקה
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 text-right">
                      האם אתה בטוח שאתה רוצה למחוק את המנה?
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:justify-center sm:px-6">
              {loading ? (
                <div className="flex justify-center w-full">
                  <Spinner />
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="mt-3 ms-10 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  >
                    ביטול
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                  >
                    מחק
                  </button>
                </>
              )}
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  type: PropTypes.bool.isRequired,
};
