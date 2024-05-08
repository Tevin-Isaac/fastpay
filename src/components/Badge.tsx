const Badge = ({ label, c = "" }: { label: string; c?: string }) => {
  return (
    <div
      className={`bg-gray-200 rounded-lg leading-none w-fit px-3 py-[6px] text-xs border-2 ${c}`}
    >
      {label}
    </div>
  );
};
export default Badge;
