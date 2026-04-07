import {motion} from "framer-motion";

const AuthToggle = ({isSignup, setIsSignup}) => (
  <div className="flex bg-slate-50 p-1 rounded-full w-fit gap-1 shadow-inner border border-slate-100 relative">
    {/* כפתור כניסה */}
    <button
      type="button"
      onClick={() => setIsSignup(false)}
      // שים לב שהורדנו מפה את ה-bg-slate-900, והוספנו relative
      className={`relative px-8 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${
        !isSignup ? "text-white" : "text-slate-500 hover:text-slate-700"
      }`}
    >
      {/* הרקע הצף של Framer Motion */}
      {!isSignup && (
          <motion.div
            layoutId="active-pill"
            className="absolute inset-0 bg-[#00C38B] rounded-full shadow-lg"
            transition={{type: "spring", stiffness: 400, damping: 30}}
          />
      )}
      {/* הטקסט עצמו - מקבל z-index כדי להישאר מעל הרקע */}
      <span className="relative z-10">כניסה</span>
    </button>

    {/* כפתור הרשמה */}
    <button
      type="button"
      onClick={() => setIsSignup(true)}
      className={`relative px-8 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${
        isSignup ? "text-white" : "text-slate-500 hover:text-slate-700"
      }`}
    >
      {/* הרקע הצף - משתמש באותו layoutId כדי ש-Framer Motion יזהה שזה אותו אלמנט שצריך לזוז */}
      {isSignup && (
          <motion.div
            layoutId="active-pill"
            className="absolute inset-0 bg-[#00C38B] rounded-full shadow-lg"
            transition={{type: "spring", stiffness: 400, damping: 30}}
          />
      )}
      <span className="relative z-10">הרשמה</span>
    </button>
  </div>
);

export default AuthToggle;
