import HeaderBar from "../../organisms/HeaderBar/HeaderBar";
import NavMenu from "../../molecules/NavMenu/NavMenu";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#fbfcee] text-[#3971b8]">
      <HeaderBar />
      <nav className="bg-[#fbfcee] border-b border-[#d3e0a9]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <NavMenu />
        </div>
      </nav>
      <main>{children}</main>
      <div className="h-10" />
    </div>
  );
}
