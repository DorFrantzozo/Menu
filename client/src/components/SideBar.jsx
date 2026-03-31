import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {logoutUser} from "@/state/user/userSlice";
import {logoutMenuCategories} from "@/state/menu/menuCategoriesSlice";
import {logoutDishes} from "@/state/menu/menuDishes";
import {Menu, X} from "lucide-react";
import logoDarkBg from "../assets/logos/logo 1200X600.png";
import logoWhiteBg from "../assets/logos/logo white background.jpg";
import {useTheme} from "@/context/ThemeContext";

const Sidebar = ({user}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("Dashboard");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // שימוש ב-Context: שליפת isDarkMode מה-Provider
  const {isDarkMode} = useTheme();

  // בחירת הלוגו המתאים לפי המצב ב-Context
  // אם אנחנו ב-Dark Mode, נבחר את הלוגו הלבן ולהפך
  const currentLogo = isDarkMode ? logoDarkBg : logoWhiteBg;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint in tailwind
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleLogOut = () => {
    dispatch(logoutUser(user));
    dispatch(logoutMenuCategories());
    dispatch(logoutDishes());
    localStorage.removeItem("token");
    localStorage.removeItem("expireTime");
    localStorage.removeItem("user_payment_history");
    navigate("/");
  };

  const menuItems = [
    {
      name: "לוח ניהול",
      key: "Dashboard",
      icon: "dashboard",
      navigate: "/dashboard",
    },
    {
      name: "מנות",
      key: "Dishes",
      icon: "list_alt",
      navigate: "/manage-dishes",
      tourKey: "dishes",
    },
    {
      name: "קטגוריות",
      key: "Categories",
      icon: "category",
      navigate: "/manage-categories",
      tourKey: "categories",
    },
    {
      name: "תפריט חי",
      key: "PublicMenu",
      icon: "restaurant_menu",
      customNavigate: () =>
        navigate(`/design${user?.designNumber || 1}`, {state: user}),
    },
    {
      name: "עיצוב",
      key: "Design",
      icon: "palette",
      navigate: "/designs",
      tourKey: "design",
    },
  ];

  const settingsItems = [
    {
      name: "הגדרות",
      key: "Settings",
      icon: "settings",
      navigate: "/profile",
    },
    {
      name: "מרכז תמיכה",
      key: "Support",
      icon: "contact_support",
      navigate: "/support",
    },
    {
      name: "התנתקות",
      key: "Logout",
      icon: "logout",
      customNavigate: handleLogOut,
    },
  ];

  const sidebarContent = (
    <aside
      dir="rtl"
      className="w-64 bg-surface-light dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 flex flex-col h-full shrink-0 z-20 transition-all duration-300"
    >
      <div className="h-16 flex items-center px-6 border-b border-zinc-100 dark:border-zinc-700/50 justify-between">
        <div className="flex items-center gap-2">
          {/* שימוש בלוגו המחושב currentLogo */}
          <img
            src={currentLogo}
            alt="Logo"
            className="w-full h-fll object-contain p-4"
          />
        </div>
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white"
          >
            <X size={24} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        {user?.role === "admin" && (
          <div className="px-4 mb-4">
            <button
              onClick={() => {
                setActive("Admin");
                navigate("/admin");
                if (isMobile) setMobileOpen(false);
              }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors"
            >
              <span className="material-icons-round text-xl">
                admin_panel_settings
              </span>
              ניהול Admin
            </button>
          </div>
        )}

        <nav className="px-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                className={`flex items-center w-full gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                  isActive
                    ? "bg-primary/10 dark:bg-emerald-950/50 text-primary dark:text-emerald-400 font-medium"
                    : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:text-zinc-900 dark:hover:text-zinc-50"
                }`}
                onClick={() => {
                  setActive(item.key);
                  if (item.customNavigate) {
                    item.customNavigate();
                  } else if (item.navigate) {
                    navigate(item.navigate);
                  }
                  if (isMobile) setMobileOpen(false);
                }}
                data-tour={item.tourKey}
              >
                <span
                  className={`material-icons-round text-xl transition-colors ${
                    isActive ? "" : "group-hover:text-primary"
                  }`}
                >
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="px-4 mt-8">
          <div className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2 px-3">
            הגדרות
          </div>
          <nav className="space-y-1">
            {settingsItems.map((item) => (
              <button
                key={item.key}
                className="flex items-center w-full gap-3 px-3 py-2.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors group"
                onClick={() => {
                  setActive(item.key);
                  if (item.customNavigate) {
                    item.customNavigate();
                  } else if (item.navigate) {
                    navigate(item.navigate);
                  }
                  if (isMobile) setMobileOpen(false);
                }}
              >
                <span className="material-icons-round text-xl group-hover:text-primary transition-colors">
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-zinc-100 dark:border-zinc-700/50">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700/50">
          <img
            alt="User Logo"
            className="w-10 h-10 rounded-full object-cover bg-zinc-200"
            src={
              user?.logo ||
              "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
            }
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50 truncate">
              {user?.restaurantName || "מסעדה"}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
              {user?.email || "email@example.com"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      <button
        className={`fixed top-4 right-4 z-50 p-2 rounded-lg bg-surface-light dark:bg-surface-dark soft-shadow border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 ${
          isMobile ? "block" : "hidden"
        }`}
        onClick={toggleSidebar}
      >
        <Menu size={24} />
      </button>

      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      <div
        className={`fixed inset-y-0 right-0 z-50 lg:static lg:block transition-transform duration-300 ease-in-out ${
          isMobile
            ? mobileOpen
              ? "translate-x-0"
              : "translate-x-full"
            : "translate-x-0"
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};

export default Sidebar;
