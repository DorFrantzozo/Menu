import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import Design1 from "../../../designs/design1";

const Menu = () => {
  const [menu, setMenu] = useState([]);
  const url = window.location.href;
  const selectedBuisness = url.split(".")[0].split("//")[1];
  const design = menu.designNumber;

  const fatchData = async (name) => {
    try {
      const response = await axios.get("http://localhost:8000/api/user/find", {
        params: { name },
      });
      console.log(response);
      setMenu(response.data);
      console.log(menu);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fatchData(selectedBuisness);
    console.log(menu);
  }, [selectedBuisness]);

  return <div>{design === 1 && <Design1 menu={menu} />}</div>;
};

export default Menu;
