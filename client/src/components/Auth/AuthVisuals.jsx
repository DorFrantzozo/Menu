import authVisual from "../../assets/img/auth-hero-saas.png";

const AuthVisuals = () => (
  <div className="hidden lg:flex lg:w-1/2 bg-[#FDFBF9] items-center justify-center relative overflow-hidden p-10">
    {/* Subtle sophisticated background details */}
    <div className="absolute top-0 right-0 w-full h-full opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
    
    <div className="relative z-10 w-full h-full flex items-center justify-center bg-white rounded-[3rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] overflow-hidden group border border-slate-100">
      <img
        src={authVisual}
        alt="Auth Visual"
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
      />
      {/* Soft overlay for premium feel */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
    </div>
  </div>
);

export default AuthVisuals;
