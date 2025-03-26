import { useSelector } from "react-redux";

import DefaultButton from "../buttons/DefaultButton";
import { useNavigate } from "react-router-dom";
const FreeTrailCounter = () => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  if (!user || !user.trialExpiresAt) {
    console.log("אין מידע על תקופת ניסיון");
  }

  const trialExpiresAt = new Date(user.trialExpiresAt);
  const dateOnly = trialExpiresAt.toLocaleDateString("he-IL");

  return (
    <div className="absolute ms-auto me-auto     " dir="rtl">
      <DefaultButton
        onClick={() => navigate("/profile")}
        bg="stone-400"
        color="white"
        text={"ניסיון חינם עד : " + dateOnly}
        className="p-4"
        width="full"
        hover="hover:scale-125  transition duration-500"
      />
    </div>
  );
};

export default FreeTrailCounter;
