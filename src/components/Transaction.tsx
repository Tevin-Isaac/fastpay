import { Down } from "../icons";
import Badge from "./Badge";
import { formatDate, formatUnixTimestamp } from "../helpers";
import { Transaction as TransactionType } from "../../fastpay-subgraph/generated/schema";
import { formatEther } from "viem";

const Transaction = ({ txn }: { txn: TransactionType }) => {
  console.log(txn);
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
        <div className="flex gap-x-2 justify-start items-center">
          <Down />
          <div className="flex flex-col items-start justify-start gap-x-2">
            <small className=" text-gray-900">
              {formatUnixTimestamp(txn?.blockTimestamp)}
            </small>
          </div>
        </div>
        <div className="flex flex-col items-center gap-x-2">
          <div className="flex items-center gap-x-2">
            <Badge label={"Paid"} />
            <p>${formatEther(txn?.value?.toString())}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Transaction;
