import { XMarkIcon } from "@heroicons/react/20/solid";

export default function Banner({
  massage = "temporery massage",
  buttonTitle = "temp button",
  freeTrailDate = "11/01/0001",
}) {
  return (
    <div
      dir="rtl"
      className="relative isolate flex justify-center items-center text-center overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5"
    >
      {/* גרדיאנט ראשון */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 -z-10 w-full h-[200px] blur-2xl"
      >
        <div
          style={{
            clipPath:
              "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
          }}
          className="w-full h-full bg-gradient-to-r from-[#bd6087] to-[#9089fc] opacity-30"
        />
      </div>

      {/* גרדיאנט שני */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 right-0 -z-10 w-full h-[200px] blur-2xl"
      >
        <div
          style={{
            clipPath:
              "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
          }}
          className="w-full h-full bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
        />
      </div>

      {/* תוכן הבאנר */}
      <div className="flex  items-center">
        <p className="text-sm text-gray-900">
          <strong className="font-semibold">Menu</strong>
          <svg
            viewBox="0 0 2 2"
            aria-hidden="true"
            className="mx-2 inline size-0.5 fill-current"
          >
            <circle r={1} cx={1} cy={1} />
          </svg>
          {massage} {freeTrailDate.split("T")[0].split("-").reverse().join("-")}
        </p>
        <a
          href="#"
          className=" ms-2 hover:scale-110 transition duration-300 flex-none rounded-full bg-gray-900 px-3.5 py-1 text-sm font-semibold text-white shadow-xs hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
        >
          {buttonTitle} <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </div>
  );
}
