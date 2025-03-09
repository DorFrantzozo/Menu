import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/baseUrl";
import Spinner from "@/components/Spinner";

const Menu = () => {
  const [menu, setMenu] = useState(null); // התחלה עם null במקום מערך ריק
  const navigate = useNavigate();
  const url = window.location.href;
  const hostname = window.location.hostname; // למשל: "restaurant-name.menu-seven-amber.vercel.app"
  const selectedBuisness = hostname.split(".")[0]; // מחלץ רק את "restaurant-name"

  console.log("Full URL:", url);
  console.log("Full Hostname:", hostname);
  console.log("Extracted Business Name:", selectedBuisness);

  const fetchData = async (name) => {
    try {
      const response = await axiosInstance.get("/user/find", {
        params: { name },
      });
      if (response.data) {
        setMenu(response.data);
      } else {
        console.error("Restaurant not found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData(selectedBuisness);
  }, [selectedBuisness]);

  useEffect(() => {
    console.log("Navigating with menu:", menu);
    if (menu && menu.designNumber === 1) {
      navigate("/design1", { state: menu });
    } else if (menu && menu.designNumber === 2) {
      navigate("/design2", { state: menu });
    }
  }, [menu, navigate]);

  return (
    <div>
      <Spinner />
    </div>
  );
};

export default Menu;
