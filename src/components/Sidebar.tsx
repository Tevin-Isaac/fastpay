"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block w-[20%]">
      <div className="flex flex-col gap-y-3  ">
        <Link
          href="/dashboard"
          className={`p-2 border rounded-md text-center ${
            pathname == "/dashboard" && "bg-black/90 text-white font-semibold"
          }`}
        >
          Dashboard
        </Link>

        <Link
          href="/links"
          className={`p-2 border rounded-md text-center ${
            pathname.includes("/links") &&
            "bg-black/90 text-white font-semibold"
          }`}
        >
          Payment Links
        </Link>

        <Link
          href="/settings"
          className={`p-2 border rounded-md text-center ${
            pathname.includes("/settings") &&
            "bg-black/90 text-white font-semibold"
          }`}
        >
          Settings
        </Link>
      </div>
    </aside>
  );
};
export default Sidebar;
