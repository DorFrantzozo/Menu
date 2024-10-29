import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

const Menu = () => {
  const [menu, setMenu] = useState([]);
  const url = window.location.href;
  const selectedBuisness = url.split(".")[0].split("//")[1];

  const fatchData = async (name) => {
    try {
      const response = await axios.get("http://localhost:8000/api/user/find", {
        params: { name }, // Pass the name as a query parameter
      });
      setMenu(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fatchData(selectedBuisness);
    console.log(menu);
  }, [selectedBuisness]);

  return <div className="text-black text-3xl">{menu.restaurantName}</div>;
};

export default Menu;
