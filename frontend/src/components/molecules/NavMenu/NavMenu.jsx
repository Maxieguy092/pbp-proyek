import NavLink from "../../atoms/NavLink/NavLink";

const items = [
  { to: "/", label: "New Arrivals" },
  { to: "/shirts", label: "Shirts" },
  { to: "/t-shirts", label: "T-Shirts" },
  { to: "/pants", label: "Pants" },
  { to: "/outerwear", label: "Outerwear" },
];

export default function NavMenu() {
  return (
    <ul className="flex justify-center flex-wrap items-center gap-6 py-3 text-sm sm:text-base">
      {items.map((i) => (
        <li key={i.to}>
          <NavLink to={i.to}>{i.label}</NavLink>
        </li>
      ))}
    </ul>
  );
}
