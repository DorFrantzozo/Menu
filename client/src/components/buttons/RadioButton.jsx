import PropTypes from "prop-types";

const RadioButton = ({ text, handleChecked }) => {
  return (
    <div dir="rtl">
      <div className="flex justify-center">
        <input
          type="checkbox"
          onChange={handleChecked}
          name={text}
          className="rounded mt-1 text-green-500 focus:ring-green-200"
        />
        <label className="text-lg ms-2 font-medium leading-6 text-gray-900">
          {text}
        </label>
      </div>
    </div>
  );
};

RadioButton.propTypes = {
  text: PropTypes.string,
  handleChecked: PropTypes.func,
};

export default RadioButton;
