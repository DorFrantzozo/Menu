import { useState } from "react";
import RadioButton from "../buttons/RadioButton";

const ShowWifi = () => {
  const [showWifi, setShowWifi] = useState("");
  const handleSelectWifi = async () => {};
  return (
    <>
      <RadioButton text="הצג WIFI" handleChecked={handleSelectWifi} />
    </>
  );
};

export default ShowWifi;
