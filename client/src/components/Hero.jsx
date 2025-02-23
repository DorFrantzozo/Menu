import mobileExample from "../assets/img/handHoldPhone.png";
import {
  PencilSquareIcon,
  PaintBrushIcon,
  UserIcon,
} from "@heroicons/react/20/solid";

const features = [
  {
    name: "Select Your Design",
    description: "Choose from a wide variety of designs to create your own",
    icon: PaintBrushIcon,
  },
  {
    name: "Edit Eny Time",
    description:
      "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.",
    icon: PencilSquareIcon,
  },
  {
    name: "24/7 Support",
    description:
      "Our team will help you with any problme or question you might have.",
    icon: UserIcon,
  },
];

export default function Hero() {
  return (
    <div className="sm:py-32 relative" dir="rtl">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {/* טקסט */}
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <h2 className="text-base font-semibold leading-7 text-green-400">
                קל ומהיר
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-black sm:text-4xl">
                תפריט בעיצוב אישי
              </p>
              <p className="mt-6 text-lg leading-8 text-black">
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

      <div className="relative w-full h-[400px] bg-gray-200 rounded-t-3xl mt-10 flex ">
        <img
          src={mobileExample}
          alt="טלפון עם תפריט"
          className="absolute bottom-full  left-40 w-[250px] sm:w-[300px] lg:w-[350px]"
        />
      </div>
    </div>
  );
}
