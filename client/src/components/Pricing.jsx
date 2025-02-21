import { CheckIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";
const includedFeatures = [
  "Variety of designs",
  "24/7 support",
  "App or website integration",
  "Official member t-shirt",
];

export default function Pricing() {
  const Navigate = useNavigate();
  const handleclick = () => {
    Navigate("/signin");
  };
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl">
            Start Your 30-day free trial
          </h2>
          <p className="mt-6 text-lg leading-8 text-black">
            Distinctio et nulla eum soluta et neque labore quibusdam. Saepe et
            quasi iusto modi velit ut non voluptas in. Explicabo id ut laborum.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl rounded-3xl  sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
          <div className="p-8 sm:p-10 lg:flex-auto">
            <h3 className="text-2xl font-semibold tracking-tight text-green-400">
              Monthly Subscription
            </h3>
            <p className="mt-6 text-base leading-7 text-black">
              Lorem ipsum dolor sit amet consect etur adipisicing elit. Itaque
              amet indis perferendis blanditiis repellendus etur quidem
              assumenda.
            </p>
            <div className="mt-10 flex items-center gap-x-4">
              <h4 className="flex-none text-sm font-semibold leading-6 text-green-400">
                What’s included
              </h4>
              <div className="h-px flex-auto bg-gray-100" />
            </div>
            <ul
              role="list"
              className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-black sm:grid-cols-2 sm:gap-6"
            >
              {includedFeatures.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon
                    aria-hidden="true"
                    className="h-6 w-5 flex-none text-green-600"
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
            <div className="rounded-2xl bg-green-400 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
              <div className="mx-auto max-w-xs px-8">
                <p className="text-base font-semibold text-black">
                  Start now and exploare
                </p>
                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-gray-900">
                    $99
                  </span>
                  <span className="text-sm font-bold leading-6 tracking-wide text-gray-600">
                    USD / Month
                  </span>
                </p>
                <button
                  onClick={handleclick}
                  className="mt-10 block w-full rounded-md bg-black px-3 py-2
                  text-center text-sm font-semibold text-wjote shadow-sm
                  focus-visible:outline focus-visible:outline-2
                  focus-visible:outline-offset-2
                 "
                >
                  Get Started
                </button>
                <p className="mt-6 text-xs leading-5 text-black">
                  Invoices and receipts available for easy company reimbursement
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
