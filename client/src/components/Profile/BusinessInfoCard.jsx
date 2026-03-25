import { 
  BuildingStorefrontIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  IdentificationIcon 
} from "@heroicons/react/24/outline";

const BusinessInfoCard = ({ user }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
      <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
        <BuildingStorefrontIcon className="w-5 h-5 text-gray-400" />
        פרטי העסק
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoItem 
          icon={<IdentificationIcon className="w-4 h-4 text-emerald-500" />} 
          label="שם המסעדה (URL)" 
          value={user?.restaurantName} 
        />
        <InfoItem 
          icon={<BuildingStorefrontIcon className="w-4 h-4 text-emerald-500" />} 
          label="שם להצגה" 
          value={user?.displayName} 
        />
        <InfoItem 
          icon={<EnvelopeIcon className="w-4 h-4 text-emerald-500" />} 
          label="אימייל" 
          value={user?.email} 
        />
        <InfoItem 
          icon={<PhoneIcon className="w-4 h-4 text-emerald-500" />} 
          label="טלפון" 
          value={user?.phone} 
        />
      </div>
      
      <p className="mt-4 text-[10px] text-gray-400 text-center">
        * המידע הזה יוצג באופן ציבורי, לכן שים לב מה אתה משתף.
      </p>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex flex-col space-y-1">
    <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500">
      {icon}
      <span>{label}</span>
    </div>
    <div className="text-sm font-semibold text-gray-800 bg-gray-50/50 p-2.5 rounded-xl border border-gray-50">
      {value || "לא הוגדר"}
    </div>
  </div>
);

export default BusinessInfoCard;
