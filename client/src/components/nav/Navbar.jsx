import { useState } from "react";
import AdminButton from "../buttons/AdminButton";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import logo from "../../assets/img/logo.png";
import NavbarSmall from "./NavbarSmall";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../state/user/userSlice";

const navigationItems = [
  { name: "Dashboard", href: "dashboard" },
  { name: "Add", href: "edit" },
  { name: "Designs", href: "designs" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const [currentNav, setCurrentNav] = useState("dashboard");
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNavClick = (item) => {
    setCurrentNav(item.href);
    navigate(`/${item.href}`);
  };

  const handleLogOut = () => {
    dispatch(logoutUser(user));
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Disclosure as="nav" className="bg-black">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <NavbarSmall />
          <div className="flex flex-shrink-0 items-center">
            <img alt="Menu" src={logo} className="ms-10 h-[100px] w-[150px]" />
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {user.role === "admin" && <AdminButton />}
                {navigationItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item)}
                    aria-current={currentNav === item.href ? "page" : undefined}
                    className={classNames(
                      currentNav === item.href
                        ? "bg-gray-200 text-black"
                        : "text-white hover:bg-gray-300 hover:text-white",
                      "rounded-md px-3 py-2 text-sm font-medium"
                    )}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button
              type="button"
              className="relative rounded-full p-1 text-green-400 hover:text-black focus:outline-none "
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">View notifications</span>
              <BellIcon aria-hidden="true" className="h-6 w-6" />
            </button>

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm  ">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  {user.logo ? (
                    <img
                      alt="user logo"
                      src={user.logo}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <img
                      alt=""
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      className="h-8 w-8 rounded-full"
                    />
                  )}
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-black py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                <MenuItem>
                  <button
                    onClick={() => navigate("/profile")}
                    className="block px-4 py-2 text-sm text-left w-full text-green-400 data-[focus]:bg-gray-700"
                  >
                    Your Profile
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    onClick={() => handleNavClick("/settings")}
                    className="block px-4 py-2 text-sm text-left w-full text-green-400 data-[focus]:bg-gray-700"
                  >
                    Settings
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    onClick={handleLogOut}
                    className="block px-4 py-2 w-full text-left text-sm text-green-400 data-[focus]:bg-gray-700"
                  >
                    Sign out
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {navigationItems.map((item) => (
            <DisclosureButton
              key={item.name}
              as="button"
              onClick={() => handleNavClick(item)}
              aria-current={currentNav === item.href ? "page" : undefined}
              className={classNames(
                currentNav === item.href
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                "block rounded-md px-3 py-2 text-base font-medium"
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
