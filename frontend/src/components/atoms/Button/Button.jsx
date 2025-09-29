export default function Button({
  as: Comp = "button",
  className = "",
  ...props
}) {
  return (
    <Comp
      className={`rounded-xl px-6 py-2 font-medium transition bg-[#3971b8] text-[#fbfcee] hover:opacity-95 active:scale-[.99] ${className}`}
      {...props}
    />
  );
}
