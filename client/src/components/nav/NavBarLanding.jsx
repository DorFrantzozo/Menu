import DefaultButton from "../buttons/DefaultButton";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/img/logo.png";
import RowButtons from "../buttons/RowButtons";
const NavBarLanding = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-zinc-950 text-white rounded h-16 w-[90%] flex items-center ">
      <div className="flex ms-10 space-x-4  ">
        <DefaultButton
          text="התחברות"
          bg="white"
          color="black"
          hover="hover:bg-black"
          hoverTextColor="hover:text-white"
          onClick={() => {
            navigate("/signin");
          }}
        />
        <DefaultButton
          text="הרשמה"
          color="white"
          onClick={() => {
            navigate("/signup");
          }}
        />
      </div>
      <div className="ms-auto">
        <RowButtons />
      </div>
      <div className="flex justify-start ms-auto">
        <img
          src={logo}
          onClick={() => navigate("/")}
          className="w-25 h-20 hover:cursor-pointer"
          alt="logo-image"
        />
      </div>
    </div>
  );
};

export default NavBarLanding;
