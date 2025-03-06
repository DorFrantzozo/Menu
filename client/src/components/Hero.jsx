import logo from "../assets/img/logoBlack.png";
import iphone from "../assets/img/iphone-landing.png";
// PaintBrushIcon,
// UserIcon,
("@heroicons/react/20/solid");
import AnimatedContent from "./TextAnimations/AnimatedContent";
import BlurText from "./TextAnimations/BlurText/BlurText";
import StarBorder from "./TextAnimations/StarBorder";
import { useNavigate } from "react-router-dom";

// const features = [
//   {
//     name: "Select Your Design",
//     description: "Choose from a wide variety of designs to create your own",
//     icon: PaintBrushIcon,
//   },
//   {
//     name: "Edit Eny Time",
//     description:
//       "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.",
//     icon: PencilSquareIcon,
//   },
//   {
//     name: "24/7 Support",
//     description:
//       "Our team will help you with any problme or question you might have.",
//     icon: UserIcon,
//   },
// ];

export default function Hero() {
  const navigate = useNavigate();
  return (
    <>
      <img
        src={logo}
        width={300}
        height={100}
        alt="logo"
        className="w-full hidden lg:block max-w-[300px] mx-auto"
      />

      <div className="w-full flex flex-col lg:flex-row justify-around px-4">
        <div className="lg:w-1/2">
          <BlurText
            text="תפריט דיגיטלי מעוצב "
            delay={150}
            animateBy="words"
            direction="top"
            className="text-[40px] md:text-[60px] mb-8 text-black mt-20 lg:mt-0 lg:me-36 text-center lg:text-left"
          />
          <div dir="rtl" className="flex flex-col items-start mt-10 lg:mt-40">
            <p className="font-bold text-start text-xl md:text-2xl">
              תפריט דיגיטלי מעוצב בלחיצת כפתור! 🍽️🚀
            </p>
            <p className="text-sm md:text-lg text-wrap mt-4">
              בחר עיצוב, עדכן מנות ומחירים בקלות, וקבל אתר תפריט מוכן עם קוד
              ברקוד לסריקה.
              <br />
              תוך דקות – התפריט שלך באוויר!
            </p>
            <button onClick={() => navigate("/signin")}>
              <StarBorder
                as="button"
                className="mt-10"
                speed="3s"
                color="green"
              >
                התחל עכשיו
              </StarBorder>
            </button>
          </div>
        </div>

        <div className="lg:w-1/2 mt-10 lg:mt-0">
          <AnimatedContent distance={400} delay={100}>
            <img
              src={iphone}
              className="w-full max-w-[800px] mx-auto -mt-16"
              alt="Menu"
            />
          </AnimatedContent>
        </div>
      </div>
      <hr className="bg-black h-[px]mb" />
    </>
  );
}
