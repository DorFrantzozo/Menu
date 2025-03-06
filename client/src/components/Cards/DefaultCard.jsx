import propTypes from "prop-types";
const DefaultCard = ({
  textColor = "black",
  cardW = "100%",
  cardH = "auto",
  icon: Icon,
  text = "demo text .............",
  title = "Title",
  bg = "white",
}) => {
  return (
    <div
      className={`w-[${cardW}] h-[${cardH}] bg-${bg} flex flex-col justify-center items-center  mt-10  rounded-xl p-6 md:p-10 gap-4`}
    >
      {/* אייקון */}
      <div className="w-20 flex justify-center">{Icon && <Icon />}</div>

      {/* טקסט */}
      <div className="w-full text-center">
        <h1 className={`text-xl font-bold text-${textColor}`}>{title}</h1>
        <p
          className={`text-lg md:text-xl font-light text-${textColor} mt-4 md:mt-6`}
          dir="rtl"
        >
          {text}
        </p>
      </div>
    </div>
  );
};

export default DefaultCard;

DefaultCard.propTypes = {
  text: propTypes.string,
  title: propTypes.string,
  bg: propTypes.string,
  cardW: propTypes.string,
  cardH: propTypes.string,
  ms: propTypes.string,
  me: propTypes.string,
  textColor: propTypes.string,
  icon: propTypes.elementType,
};
