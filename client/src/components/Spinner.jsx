import React from "react";

const Spinner = ({ isLoading = true, fullScreen = false }) => {
  if (!isLoading) return null;

  const letters = [
    { char: "I", delay: "0.0s", isSpace: true },
    { char: "M", delay: "0.15s" },
    { char: "E", delay: "0.30s" },
    { char: "N", delay: "0.45s" },
    { char: "U", delay: "0.60s" },
  ];

  return (
    <>
      <style>
        {`
          @keyframes letterDrop {
            0% {
              transform: translateY(-60px);
              opacity: 0;
            }
            10% {
              transform: translateY(0);
              opacity: 1;
            }
            75% {
              transform: translateY(0);
              opacity: 1;
            }
            80% {
              transform: translateY(10px);
              opacity: 0;
            }
            100% {
              transform: translateY(10px);
              opacity: 0;
            }
          }
          .animate-letter-drop {
            animation: letterDrop 3.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite;
            display: inline-block;
            opacity: 0;
            will-change: transform, opacity;
          }
        `}
      </style>
      
      {fullScreen ? (
        <div className="fixed top-0 left-0 w-[100vw] h-[100vh] z-[9999] flex items-center justify-center bg-[#18181B]">
          <div
            className="uppercase text-white font-extrabold text-6xl md:text-8xl flex"
            dir="ltr"
            style={{
              fontFamily: "'Oswald', 'League Gothic', 'Inter', sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            {letters.map((item, index) => (
              <span
                key={index}
                className="animate-letter-drop"
                style={{
                  animationDelay: item.delay,
                  marginRight: item.isSpace ? "0.3em" : "0",
                }}
              >
                {item.char}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center py-12 w-full">
          <div className="bg-[#18181B] rounded-full px-8 py-3 shadow-lg flex items-center justify-center">
            <div
              className="uppercase text-white font-extrabold text-xl md:text-2xl flex"
              dir="ltr"
              style={{
                fontFamily: "'Oswald', 'League Gothic', 'Inter', sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              {letters.map((item, index) => (
                <span
                  key={`inline-${index}`}
                  className="animate-letter-drop"
                  style={{
                    animationDelay: item.delay,
                    marginRight: item.isSpace ? "0.3em" : "0",
                  }}
                >
                  {item.char}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Spinner;
