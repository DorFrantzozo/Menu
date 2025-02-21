import PropTypes from "prop-types";
import milk from "../../assets/img/milk.png";
import pregnant from "../../assets/img/pregnant.png";
import gluten from "../../assets/img/gluten.png";
import vegi from "../../assets/img/vegetable.png";

const Alergies = ({ dish }) => {
  return (
    <div className="flex ">
      <div>{dish.lactose && <img src={milk} alt="milk" width={25} />}</div>
      <div>{dish.gluten && <img src={gluten} alt="gluten" width={25} />} </div>
      <div>
        {dish.pregnant && <img src={pregnant} alt="pregnant" width={25} />}{" "}
      </div>
      <div>{dish.vegi && <img src={vegi} alt="vegi" width={25} />} </div>
    </div>
  );
};
export default Alergies;

Alergies.propTypes = {
  dish: PropTypes.shape({
    lactose: PropTypes.bool,
    gluten: PropTypes.bool,
    pregnant: PropTypes.bool,
    vegi: PropTypes.bool,
  }).isRequired,
};
