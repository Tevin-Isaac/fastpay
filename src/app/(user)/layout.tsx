import MobileNav from "../../components/MobileNav";
import Sidebar from "../../components/Sidebar";

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <section className="h-full lg:flex gap-x-6">
      <Sidebar />
      <main className="px-4 lg:px-6 lg:w-[50%] lg:border-l">{children}</main>
      <MobileNav />
    </section>
  );
};
export default DashboardLayout;
