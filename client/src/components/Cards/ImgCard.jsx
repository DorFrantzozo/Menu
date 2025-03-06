import propTypes from "prop-types";
import iped from "@/assets/img/ipad.jpeg";

const defaultImg = iped;

const ImgCard = ({
  textColor = "white",
  cardW = "100%",
  cardH = "auto",
  img = defaultImg,
  imgH = "500px",
  imgW = "600px",
  text = "demo text .............",
  title = "Title",
  bg = "white",
  ms = "",
  me = "",
}) => {
  return (
    <div
      className={`w-[${cardW}] h-[${cardH}] bg-${bg} flex flex-wrap md:flex-nowrap justify-center items-center border mt-10 shadow rounded-xl p-6 md:p-10 gap-6`}
    >
      {/* תמונה */}
      <div className="w-full md:w-auto flex justify-center">
        <img
          src={img}
          alt={title}
          className={`rounded-xl w-[${imgW}] h-[${imgH}] ms-${ms} me-${me} shadow-lg  max-w-[90%] md:max-w-[600px]`}
        />
      </div>

      {/* טקסט */}
      <div className="w-full md:w-1/2 text-center md:text-right">
        <h1
          className={`text-2xl md:text-4xl font-bold whitespace-nowrap text-${textColor}`}
        >
          {title}
        </h1>
        <p
          className={`text-lg md:text-xl font-light text-${textColor} mt-4 md:mt-8`}
          dir="rtl"
        >
          {text}
        </p>
      </div>
    </div>
  );
};

export default ImgCard;

ImgCard.propTypes = {
  imgW: propTypes.string,
  imgH: propTypes.string,
  img: propTypes.string,
  text: propTypes.string,
  title: propTypes.string,
  bg: propTypes.string,
  cardW: propTypes.string,
  cardH: propTypes.string,
  ms: propTypes.string,
  me: propTypes.string,
  textColor: propTypes.string,
};
