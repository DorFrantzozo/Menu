import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/baseUrl";
import Spinner from "@/components/Spinner";
import useTrackMenuView from "@/hooks/useTrackMenuView";

// Import Designs
import Design1 from "../designs/Design1/Design1";
import Design2 from "../designs/Design2/Design2";
import Design3 from "../designs/Design3/Design3";
import Design4 from "../designs/Design4/Design4";

const Menu = () => {
  const [menu, setMenu] = useState(null);
  const navigate = useNavigate();
  const hostname = window.location.hostname;
  const selectedBuisness = hostname.split(".")[0];

  // Track view if we have a menu and it has an ID
  useTrackMenuView(menu?._id);

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

  if (!menu) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  // Check for trial/payment status
  if (
    !menu.isPaid &&
    menu.trialExpiresAt &&
    new Date(menu.trialExpiresAt) <= new Date()
  ) {
    navigate("/"); // Or some "Plan Expired" page
    return null;
  }

  return (
    <div className="relative">
      {menu.designNumber === 1 && <Design1 menu={menu} />}
      {menu.designNumber === 2 && <Design2 menu={menu} />}
      {menu.designNumber === 3 && <Design3 menu={menu} />}
      {menu.designNumber === 4 && <Design4 menu={menu} />}
    </div>
  );
};

export default Menu;
