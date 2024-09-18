import {
  PencilSquareIcon,
  PaintBrushIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import ipad from "../assets/img/ipad.jpeg";
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
    <div className="overflow-hidden bg-black py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <h2 className="text-base font-semibold leading-7 text-green-400">
                Eazy And Fast
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Personalized menus for each restaurant
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Restaurants can create custom menus tailored to their customers
                tastes. They can also adjust prices based on customer feedback.
                This allows them to provide the best possible experience to
                their customers.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-300 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-bold  text-white">
                      <feature.icon
                        aria-hidden="true"
                        className="absolute left-1 top-1 h-5 w-5 text-green-400"
                      />
                      {feature.name}
                    </dt>{" "}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <img
            alt="Product screenshot"
            src={ipad}
            width={2432}
            height={1442}
            className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
          />
        </div>
      </div>
    </div>
  );
}
