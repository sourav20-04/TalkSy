const base =
  "group inline-flex items-center gap-2 font-bold " +
  "rounded-[20px] px-7 py-3 border-0 box-border " +
  "transition-colors duration-200";

const variants = {
  primary: "bg-[#645bff] text-white hover:bg-[#111]",
};

export default function ArrowButton({
  children,
  onClick,
  variant = "primary",
}) {
  return (
    <button onClick={onClick} className={`${base} cursor-pointer ${variants[variant]}`}>
      {children}

      {/* Arrow */}
      <span className="flex items-center justify-center">
        <span
          className="
            relative mt-px h-0.5 w-2.5
            bg-[#645bff]
            transition-all duration-200
            group-hover:bg-white
          "
        >
          <span
            className="
              absolute top-[-3px] right-[3px]
              h-2 w-2
              border-r-2 border-b-2 border-white
              -rotate-45
              transition-all duration-200
              group-hover:right-0
            "
          />
        </span>
      </span>
    </button>
  );
}
