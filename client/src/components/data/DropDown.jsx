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

export function DropDown({
  dropDownTitle = "title",
  dropDownItems = ["Item 1", "Item 2", "Item 3"],
  handelSelectedProp,
}) {
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    console.log("Selected Item:", selectedItem);
  }, [selectedItem]);

  const handleStatusChange = (item) => {
    setSelectedItem(item);
    if (handelSelectedProp) {
      handelSelectedProp(item);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-transparent shadow-none hover:text-black text-white hover:bg-transparent">
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-center bg-black text-white">
        <DropdownMenuLabel className="text-white">
          {dropDownTitle}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-zinc-700" />
        <DropdownMenuGroup>
          {dropDownItems.map((item, index) => (
            <DropdownMenuItem
              key={index}
              className="text-white hover:bg-zinc-800"
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
}

DropDown.propTypes = {
  dropDownTitle: PropTypes.string,
  dropDownItems: PropTypes.arrayOf(PropTypes.string),
  handelSelectedProp: PropTypes.func,
};

export default DropDown;
