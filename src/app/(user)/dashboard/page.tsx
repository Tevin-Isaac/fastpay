import Link from "next/link";
import { ChevronRight, Links } from "../../../icons";
import AccountCard from "../../../components/AccountCard";
import Transactions from "../../../components/Transactions";

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-y-4">
      <AccountCard />

      <div className="flex flex-col gap-y-2">
        <div className="flex items-center justify-between py-2">
          <p>Recent transactions</p>
          <Link
            href="/links"
            className="flex items-center justify-end gap-x-1 px-2 py-1"
          >
            <p>My links</p>

            <ChevronRight />
          </Link>
        </div>

        <Transactions />
      </div>
    </div>
  );
};
export default Dashboard;
