import { Button } from "@headlessui/react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const DefaultButton = ({
  text = "דוגמה לכפתור",
  onClick,
  bg = "",
  color = "text-black",
  hover = "",
  className = "",
  hoverTextColor = "",
  width = "80px",
  ariaLable = "",
  icon = null
}) => {
  const navigate = useNavigate();
  const handleClick = onClick || (() => navigate("/signin"));

  return (
    <Button
      onClick={handleClick}
      aria-label={`${ariaLable}`}
      className={`text-${color} font-light rounded-xl p-2 ${hover} ${hoverTextColor} transition duration-500 w-[${width}]  bg-${bg} ${className}`} 
    >
      {icon && <span className="mr-2">{icon}</span>}
      {text}
    </Button>
  );
};

export default DefaultButton;

DefaultButton.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  bg: PropTypes.string,
  color: PropTypes.string,
  hover: PropTypes.string,
  hoverTextColor: PropTypes.string,
  width: PropTypes.string,
};
