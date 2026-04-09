import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const DefaultDropDown = ({
  dropDownTitle = "title",
  dropDownItems = ["Item 1", "Item 2", "Item 3"],
  handelSelectedProp,
  textColor = "text-black",
  bgColor = "bg-white",
  hoverColor = "hover:bg-zinc-400",
  border = "none",
}) => {
  const [selectedItem, setSelectedItem] = useState(null);

 

  const handleStatusChange = (item) => {
    setSelectedItem(item);
    if (handelSelectedProp) {
      handelSelectedProp(item);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={`bg-transparent shadow-none ${border} hover:text-black ${textColor} hover:bg-transparen`}
        >
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={`w-56 text-center ${bgColor} ${textColor}`}
      >
        <DropdownMenuLabel className={`${textColor}`}>
          {dropDownTitle}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-zinc-700" />
        <DropdownMenuGroup>
          {dropDownItems.map((item, index) => (
            <DropdownMenuItem
              key={index}
              className={`${textColor} ${hoverColor}  flex justify-center `}
              onClick={() => handleStatusChange(item)}
            >
              {item}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-zinc-700" />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DefaultDropDown;

DefaultDropDown.propTypes = {
  dropDownTitle: PropTypes.string,
  dropDownItems: PropTypes.arrayOf(PropTypes.string),
  handelSelectedProp: PropTypes.func,
  textColor: PropTypes.string,
  bgColor: PropTypes.string,
};
