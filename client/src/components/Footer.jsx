import {useNavigate} from "react-router-dom";
import {Mail, Phone, Facebook, Instagram, Linkedin, Github} from "lucide-react";
import logo from "../assets/img/logo.avif";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-zinc-900 text-white py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* לוגו */}
        <div>
          <img
            src={logo}
            alt="iMenu logo"
            width={160}
            height={80}
            loading="lazy"
            className="mb-4 w-[300px] h-[100px] object-contain"
          />
          <p className="text-sm text-gray-400">
            מערכת ניהול תפריטים חכמה לעסקים.
          </p>
        </div>

        {/* תפריט */}
        <div>
          <h6 className="text-lg font-semibold mb-4 text-white">תפריט</h6>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <button
                onClick={() => navigate("/signin")}
                className="hover:text-white"
              >
                התחברות
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/signup")}
                className="hover:text-white"
              >
                הרשמה
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/termofservice")}
                className="hover:text-white"
              >
                תנאי שימוש
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/accessibility")}
                className="hover:text-white"
              >
                הצהרת נגישות
              </button>
            </li>
          </ul>
        </div>

        {/* רשתות חברתיות */}
        <div>
          <h6 className="text-lg font-semibold mb-4 text-white">עקבו אחרינו</h6>
          <div className="flex gap-4 text-gray-300">
            <a
              href="https://facebook.com"
              aria-label="Facebook"
              className="hover:text-white"
            >
              <Facebook size={20} />
            </a>
            <a
              href="https://instagram.com"
              aria-label="Instagram"
              className="hover:text-white"
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://linkedin.com"
              aria-label="LinkedIn"
              className="hover:text-white"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="https://github.com/DorFrantzozo"
              aria-label="GitHub"
              className="hover:text-white"
            >
              <Github size={20} />
            </a>
          </div>
        </div>

        {/* צור קשר */}
        <div dir="rtl">
          <h6 className="text-lg font-semibold mb-4 text-white">צור קשר</h6>
          <ul className="text-sm space-y-3 text-gray-300">
            <li className="flex items-center gap-2">
              <Mail size={16} />
              imenuservice@gmail.com
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} />
              053-4314774
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-zinc-700 mt-10 pt-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} iMenu. כל הזכויות שמורות.
      </div>
    </footer>
  );
};

export default Footer;
