import { useNavigate } from "react-router-dom";
import StarBorder from "../TextAnimations/StarBorder";

const AdminButton = () => {
  const navigate = useNavigate();
  return (
    <StarBorder onClick={() => navigate("/admin")}>
      <p>Admin</p>
    </StarBorder>
  );
};

export default AdminButton;
