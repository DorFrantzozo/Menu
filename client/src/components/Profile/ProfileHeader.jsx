import { UserCircleIcon } from "@heroicons/react/24/outline";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";

const ProfileHeader = ({ user }) => {
  return (
    <div className="relative mb-12">
      {/* Slim Banner */}
      <div className="h-24 w-full bg-zinc-900 rounded-b-xl shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      </div>

      {/* Logo Container with negative margin */}
      <div className="flex flex-col items-center -mt-12 relative z-10 px-4">
        <div className="relative">
          {user?.logo ? (
            <img
              className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-white object-cover"
              src={user.logo}
              alt="restaurant logo"
            />
          ) : (
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-gray-50 flex items-center justify-center">
              <UserCircleIcon className="w-12 h-12 text-gray-300" />
            </div>
          )}
          
          {/* Status Pulse */}
          <div className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow-sm">
             <div className="bg-emerald-500 w-3 h-3 rounded-full border-2 border-white animate-pulse"></div>
          </div>
        </div>

        <div className="mt-3 text-center">
          <div className="flex items-center justify-center gap-1.5">
            <h1 className="text-xl font-black text-zinc-900">{user?.displayName || user?.restaurantName}</h1>
            <CheckBadgeIcon className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-[11px] font-bold text-emerald-600 mt-0.5 flex items-center justify-center gap-1">
             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
             התפריט שלך באוויר
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
