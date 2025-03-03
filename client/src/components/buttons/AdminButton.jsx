import { useNavigate } from "react-router-dom";
import StarBorder from "../TextAnimations/StarBorder";

const AdminButton = () => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate("/admin")}>
      <StarBorder>
        <p>Admin</p>
      </StarBorder>
    </button>
  );
};

export default AdminButton;
