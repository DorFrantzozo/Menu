import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/baseUrl";

const Menu = () => {
  const [menu, setMenu] = useState(null); // התחלה עם null במקום מערך ריק
  const navigate = useNavigate();
  const url = window.location.href;
  const selectedBuisness = url.split(".")[0].split("//")[1];

  const fetchData = async (name) => {
    try {
      const response = await axiosInstance.get("/user/find", {
        params: { name },
      });
      setMenu(response.data);
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

  return <div>Loading...</div>;
};

export default Menu;
