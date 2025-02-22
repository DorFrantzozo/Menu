import { Button } from "@headlessui/react";
import Proptype from "prop-types";
import { useNavigate } from "react-router-dom";
const DefaultButton = ({
  text = "דוגמה לכפתור",
  onClick,
  bg = "",
  color = "text-black",
  hover = "",
  hoverTextColor = "",
}) => {
  const navigate = useNavigate();
  const handleClick = onClick || (() => navigate("/signin"));

  return (
    <Button
      onClick={handleClick}
      className={`text-${color} font-semibold rounded p-1 ${hover} ${hoverTextColor} transition duration-500 w-[80px]  bg-${bg}`}
    >
      {text}
    </Button>
  );
};

export default DefaultButton;

DefaultButton.propTypes = {
  text: Proptype.string.isRequired,
  onClick: Proptype.func,
  bg: Proptype.string,
  color: Proptype.string,
  hover: Proptype.string,
  hoverTextColor: Proptype.string,
};
