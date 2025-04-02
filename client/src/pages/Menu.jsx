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

  const fetchData = async (name) => {
    console.log(name);
    try {
      const response = await axiosInstance.get("/user/find", {
        params: { name },
      });

      if (response.data) {
        setMenu(response.data);
        console.log(response.data);
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
    if (menu !== null) {
      if (
        menu.isPaid ||
        (menu.trialExpiresAt && new Date(menu.trialExpiresAt) > new Date())
      ) {
        if (menu.designNumber === 1) {
          navigate("/design1", { state: menu });
        } else if (menu.designNumber === 2) {
          navigate("/design2", { state: menu });
        } else if (menu.designNumber === 3) {
          navigate("/design3", { state: menu });
        }
      } else {
        navigate("/");
      }
    }
  }, [menu, navigate]);

  return (
    <div>
      <Spinner />
    </div>
  );
};

export default Menu;
