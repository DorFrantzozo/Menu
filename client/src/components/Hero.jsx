import Iphone3D from "./animations/Iphone3D";
import {} from // PencilSquareIcon,
// PaintBrushIcon,
// UserIcon,
"@heroicons/react/20/solid";
import BlurText from "./TextAnimations/BlurText/BlurText";
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
  return (
    <div className="sm:py-32 relative" dir="rtl">
      <div className="hidden lg:block">
        <div className="bg-black w-[200px] h-24 absolute sm:mt-[420px] ms-[200px] z-10 "></div>
        <Iphone3D />
      </div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <BlurText
                text="תפריט בעיצוב אישי"
                className="text-3xl text-white"
                rootMargin="400px"
              />

              <p className="mt-6 text-lg leading-8 text-white">
                צרו תפריט מותאם אישית שיגרום ללקוחות שלכם להתאהב. <br />
                המערכת שלנו מאפשרת לכם לבחור ממבחר עיצובים או לעצב תפריט ייחודי
                שמשקף את סגנון המסעדה ומתאים בדיוק להעדפות הלקוחות. תוכלו לעדכן
                את התפריט בקלות בכל רגע.
                <br />
                הצטרפו אלינו והעניקו ללקוחות שלכם את החוויה הטובה ביותר – בדיוק
                כמו שהם מצפים.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="relative w-full h-[400px] bg-gray-200 rounded-t-3xl mt-10 flex ">
        <img
          src={mobileExample}
          alt="טלפון עם תפריט"
          className="absolute bottom-full  left-40 w-[250px] sm:w-[300px] lg:w-[350px]"
        />
      </div> */}
    </div>
  );
}
