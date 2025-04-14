import PropTypes from "prop-types";

const ToggleButton = ({ checked, onChange }) => {
  return (
    <div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={onChange}
        />
        <div className="group peer bg-gray-600 rounded-full duration-300 w-16 h-8 ring-2 after:duration-300 after:bg-white peer-checked:after:bg-white peer-checked:bg-green-500 after:rounded-full after:absolute after:h-6 after:w-6 after:top-1 after:left-1 after:flex after:justify-center after:items-center peer-checked:after:translate-x-8 peer-hover:after:scale-95"></div>
      </label>
    </div>
  );
};

export default ToggleButton;

ToggleButton.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
};
