import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Folder,
  Utensils,
  Globe,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  BrushIcon,
} from "lucide-react";
import logo from "../assets/img/logoBlack.avif";
import { useNavigate } from "react-router-dom";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/state/user/userSlice";
import { logoutMenuCategories } from "@/state/menu/menuCategoriesSlice";
import { logoutDishes } from "@/state/menu/menuDishes";

const Sidebar = ({ user }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("Dashboard");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const handleLogOut = () => {
    dispatch(logoutUser(user));
    dispatch(logoutMenuCategories());
    dispatch(logoutDishes());
    localStorage.removeItem("token");
    localStorage.removeItem("expireTime");
    navigate("/");
  };

  const menuItems = [
    {
      name: "לוח ניהול",
      key: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      navigate: "/dashboard",
    },
    {
      name: "קטגוריות",
      key: "Categories",
      icon: <Folder size={20} />,
      navigate: "/manage-categories",
    },
    {
      name: "מנות",
      key: "Dishes",
      icon: <Utensils size={20} />,
      navigate: "/manage-dishes",
    },
    {
      name: "תפריט",
      key: "PublicMenu",
      icon: <Globe size={20} />,
      customNavigate: () =>
        navigate(`/design${user.designNumber}`, { state: user }),
    },
    {
      name: "עיצוב",
      key: "Design",
      icon: <BrushIcon size={20} />,
      navigate: "/designs",
    },
    {
      name: "הגדרות",
      key: "Settings",
      icon: <Settings size={20} />,
      navigate: "/profile",
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarContent = (
    <div
      dir="rtl"
      className={`min-h-screen sticky top-0 overflow-y-auto bg-white shadow-lg flex flex-col justify-between transition-all duration-300 ease-in-out ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b">
        <div className="flex items-center gap-2">
          {!collapsed && (
            <img
              src={logo}
              alt="logo"
              className="w-16 h-16 rounded-md object-cover"
            />
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="text-gray-500 hover:text-black"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <hr />

      {/* Menu Items */}
      <nav className="flex-1 mt-4 space-y-1">
        {!collapsed && user?.role === "admin" && (
          <button
            onClick={() => navigate("/admin")}
            className="flex hover:bg-gray-200 w-full px-4 py-2 items-center"
          >
            <UserCircleIcon className="w-6 h-6 text-black" />
            <p className="px-2 cursor-pointer py-4 flex items-center gap-2">
              Admin
            </p>
          </button>
        )}

        {menuItems.map((item) => (
          <button
            key={item.name}
            className={`flex gap-2 px-4 py-3 transition rounded w-full items-center
              ${
                active === item.name
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            onClick={() => {
              setActive(item.name);
              if (item.customNavigate) {
                item.customNavigate();
              } else if (item.navigate) {
                navigate(item.navigate);
              }
              if (isMobile) setMobileOpen(false);
            }}
          >
            {item.icon}
            {!collapsed && <span>{item.name}</span>}
          </button>
        ))}

        <hr className="my-2" />

        {!collapsed && user && (
          <div className="px-4 pb-4">
            <h1 className="text-sm font-semibold text-center">
              מידע על המסעדה
            </h1>
            <div className="flex gap-3 mt-2" dir="ltr">
              <img
                src={user.logo}
                className="w-12 h-12 rounded-xl bg-gray-400 p-2 shadow-sm object-cover"
                alt="user logo"
              />
              <div>
                <h2 className="text-sm font-medium">{user.restaurantName}</h2>
                <h3 className="text-xs text-gray-500">{user.email}</h3>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Logout */}
      <div className="py-2">
        <button
          onClick={handleLogOut}
          className="w-full flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded transition"
        >
          <LogOut size={20} />
          {!collapsed && <span>התנתקות</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile sidebar */}
      {isMobile && (
        <>
          <button
            className="fixed top-4 right-4 z-50 bg-white p-2 rounded-full shadow-md md:hidden"
            onClick={toggleSidebar}
          >
            <Menu />
          </button>

          <div
            className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300 ${
              mobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
            onClick={() => setMobileOpen(false)}
          />

          <div
            className={`fixed top-0 right-0 h-full z-50 bg-white shadow-lg transition-transform duration-300 ease-in-out ${
              mobileOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {sidebarContent}
          </div>
        </>
      )}

      {/* Desktop sidebar */}
      {!isMobile && <div>{sidebarContent}</div>}
    </>
  );
};

export default Sidebar;
