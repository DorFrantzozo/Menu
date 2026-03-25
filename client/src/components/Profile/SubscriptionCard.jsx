import { 
  CreditCardIcon, 
  CalendarIcon, 
  FingerPrintIcon, 
  ClipboardDocumentIcon,
  PencilSquareIcon
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SubscriptionCard = ({ user }) => {
  const navigate = useNavigate();

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("מזהה משתמש הועתק!");
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col h-full">
      <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
        <CreditCardIcon className="w-5 h-5 text-gray-400" />
        חשבון ומנוי
      </h3>

      <div className="space-y-3 flex-grow">
        <div className="flex justify-between items-center p-2.5 bg-gray-50/50 rounded-xl border border-gray-50">
          <div className="flex items-center gap-2">
            <CreditCardIcon className="w-4 h-4 text-emerald-500" />
            <span className="text-xs text-gray-600 font-bold">סוג מנוי</span>
          </div>
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${user?.isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-700'}`}>
            {user?.isPaid ? "PREMIUM" : "FREE TRIAL"}
          </span>
        </div>

        <div className="flex justify-between items-center p-2.5 bg-gray-50/50 rounded-xl border border-gray-50">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-emerald-500" />
            <span className="text-xs text-gray-600 font-bold">חבר מאז</span>
          </div>
          <span className="text-xs font-bold text-gray-800">
            {user?.createdAt?.split("T")[0]}
          </span>
        </div>

        <div className="flex justify-between items-center p-2.5 bg-gray-50/50 rounded-xl border border-gray-50">
          <div className="flex items-center gap-2">
            <FingerPrintIcon className="w-4 h-4 text-emerald-500" />
            <span className="text-xs text-gray-600 font-bold">מזהה משתמש</span>
          </div>
          <div className="flex items-center gap-1.5 direction-ltr">
            <button 
              onClick={() => copyToClipboard(user?._id)}
              className="p-1 hover:bg-gray-200 rounded-md transition-colors order-first"
              title="העתק מזהה"
            >
              <ClipboardDocumentIcon className="w-3.5 h-3.5 text-gray-400" />
            </button>
            <span className="text-[10px] text-gray-400 font-mono max-w-[60px] truncate">
              {user?._id}
            </span>
          </div>
        </div>

        {user?.designNumber && (
          <div className="flex justify-between items-center p-2.5 bg-gray-50/50 rounded-xl border border-gray-50">
            <div className="flex items-center gap-2">
               <span className="text-xs text-gray-600 font-bold">עיצוב נבחר</span>
            </div>
            <span className="text-xs font-bold text-gray-800">
              #{user?.designNumber}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionCard;
