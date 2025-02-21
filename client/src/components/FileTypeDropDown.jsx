import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

const fileType = [{ video: "סרטון" }, { image: "תמונה" }];

const FileTypeDropDown = ({ setType }) => {
  const [dropTitle, setDropTitle] = useState("");

  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton className="flex flex-row-reverse w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
        {dropTitle ? dropTitle : "סוג קובץ"}
        <ChevronDownIcon
          aria-hidden="true"
          className="-mr-1 h-5 w-5 text-gray-400"
        />
      </MenuButton>

      <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="py-1">
          {fileType.length > 0 ? (
            fileType.map((item, index) => {
              const key = Object.keys(item)[0];
              const value = item[key];

              return (
                <MenuItem key={index}>
                  {(active) => (
                    <button
                      onClick={() => {
                        setType(key); // Update type state in parent
                        setDropTitle(value); // Update dropdown label
                      }}
                      className={`${
                        active
                          ? "bg-white text-center text-gray-900 hover:bg-slate-100"
                          : "text-gray-700"
                      } block px-4 py-2 text-sm w-full text-left`}
                    >
                      {value}
                      <hr className=" w-3/4 mx-auto" />
                    </button>
                  )}
                </MenuItem>
              );
            })
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">
              סוג קובץ לא זמין
            </div>
          )}
        </div>
      </MenuItems>
    </Menu>
  );
};

export default FileTypeDropDown;
