import React from "react";
import {useNavigate} from "react-router-dom";
import {Disclosure, DisclosureButton, DisclosurePanel} from "@headlessui/react";
import {Bars3Icon, XMarkIcon} from "@heroicons/react/24/outline";
import {useTheme} from "@/context/ThemeContext";

// ייבוא הלוגואים
import logoWhiteBg from "../../assets/logos/logo white background.jpg";
import logoDarkBg from "../../assets/logos/logo 1200X600.png";

const navigation = [
  {name: "ניתוח נתונים", href: "#features"},
  {name: "מחירים", href: "#pricing"},
  {name: "לקוחות", href: "#customers"},
];

export default function NavBarLanding() {
  const navigate = useNavigate();
  const {isDarkMode} = useTheme();

  // בחירת הלוגו לפי התימה
  // ב-Landing2 התימה תמיד בהירה לפי ה-Context שלך, לכן יוצג logoWhiteBg
  const currentLogo = isDarkMode ? logoDarkBg : logoWhiteBg;

  return (
    <Disclosure
      as="nav"
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-100 dark:bg-zinc-950/80 dark:border-zinc-800"
      dir="rtl"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative flex h-20 items-center justify-between">
          {/* Right: Logo Section */}
          <div className="flex shrink-0 items-center">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
            >
              {/* החלפנו את האימוג'י והטקסט בתמונת הלוגו */}
              <img
                src={currentLogo}
                alt="MenuYou Logo"
                className="h-20 md:h-20 w-auto object-contain"
              />
            </button>
          </div>

          {/* Center: Navigation Links */}
          <div className="hidden md:flex flex-1 justify-center items-center">
            <div className="flex space-x-10 space-x-reverse">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* Left: Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/signin")}
              className="hidden sm:block text-sm font-bold text-zinc-900 hover:text-emerald-600 dark:text-zinc-100 dark:hover:text-emerald-400 transition-colors"
            >
              כניסה למערכת
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="bg-zinc-900 text-white px-4 py-2 md:px-6 md:py-2.5 rounded-xl text-sm md:text-base font-black transition-all hover:bg-emerald-600 hover:scale-105 active:scale-95 shadow-lg shadow-zinc-200 dark:shadow-none"
            >
              הרשמה חינם
            </button>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden ms-2">
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-xl p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none dark:hover:bg-zinc-800">
                <Bars3Icon className="block h-6 w-6 group-open:hidden" />
                <XMarkIcon className="hidden h-6 w-6 group-open:block" />
              </DisclosureButton>
            </div>
          </div>
        </div>
      </div>

      <DisclosurePanel className="md:hidden bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-800">
        <div className="space-y-1 px-4 pb-6 pt-2">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              className="block rounded-xl px-4 py-3 text-base font-bold text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-white transition-all"
            >
              {item.name}
            </DisclosureButton>
          ))}
          <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
            <button
              onClick={() => navigate("/signin")}
              className="block w-full text-right px-4 py-3 text-base font-bold text-zinc-500 dark:text-zinc-400"
            >
              כניסה למערכת
            </button>
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
