const AuthInput = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  ...props
}) => (
  <div className="flex flex-col w-full text-right">
    <label className="text-sm font-bold text-slate-700 mb-2 mr-4">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full bg-slate-50 border border-slate-100 rounded-full px-6 py-3.5 text-slate-800 placeholder:text-slate-300 focus:border-emerald-200 focus:bg-white focus:ring-4 focus:ring-emerald-50 outline-none transition-all"
      {...props}
    />
  </div>
);

export default AuthInput;
