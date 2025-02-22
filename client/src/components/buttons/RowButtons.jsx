import DefaultButton from "./DefaultButton";

const RowButtons = () => {
  return (
    <div className="bg-neutral-800 rounded p-1 space-x-6 px-5">
      <DefaultButton text="צור קשר" hover="hover:bg-zinc-500" />
      <DefaultButton text="עלינו" hover="hover:bg-zinc-500" />
      <DefaultButton text="תפריט" hover="hover:bg-zinc-500" />
    </div>
  );
};

export default RowButtons;
