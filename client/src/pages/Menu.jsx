import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const [menu, setMenu] = useState(null); // התחלה עם null במקום מערך ריק
  const navigate = useNavigate();
  const url = window.location.href;
  const selectedBuisness = url.split(".")[0].split("//")[1];

  const fetchData = async (name) => {
    try {
      const response = await axios.get("http://localhost:8000/api/user/find", {
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
    if (menu && menu.designNumber === 1) {
      navigate("/design1");
    } else if (menu && menu.designNumber === 2) {
      navigate("/design2");
    }
  }, [menu, navigate]);

  return <div>Loading...</div>;
};

export default Menu;
