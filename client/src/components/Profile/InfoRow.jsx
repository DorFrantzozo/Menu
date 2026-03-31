// קומפוננטה פנימית לשורות המידע
export const InfoRow = ({icon: Icon, label, value}) => (
  <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
    <Icon className="w-6 h-6 text-zinc-400" />
    <div>
      <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">
        {label}
      </p>
      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
        {value}
      </p>
    </div>
  </div>
);
