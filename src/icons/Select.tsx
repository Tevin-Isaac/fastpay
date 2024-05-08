const Select = ({ selected = false }: { selected?: boolean }) => {
  return (
    <div
      className={`${selected && "bg-black/80"} w-5 h-5 rounded-full border-2`}
    ></div>
  );
};
export default Select;
