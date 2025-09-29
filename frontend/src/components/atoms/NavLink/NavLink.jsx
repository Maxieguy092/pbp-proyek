import { NavLink as RRNavLink } from "react-router-dom";

export default function NavLink({ to, children }) {
  return (
    <RRNavLink
      to={to}
      className={({ isActive }) =>
        `pb-1 transition hover:opacity-90 ${
          isActive
            ? "font-semibold after:block after:h-[2px] after:bg-[#3971b8]"
            : ""
        }`
      }
    >
      {children}
    </RRNavLink>
  );
}
