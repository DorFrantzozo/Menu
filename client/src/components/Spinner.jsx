import { BarLoader } from "react-spinners";
const Spinner = () => {
  return (
    <div className="flex justify-center mt-44 mb-20">
      <BarLoader color="#060606" margin={1} size={20} speedMultiplier={1} />
    </div>
  );
};

export default Spinner;
