"use client";
import { Info } from "../icons";
import Transaction from "./Transaction";
import { useAccount } from "wagmi";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Transaction as TransactionType } from "../../fastpay-subgraph/generated/schema";

const Transactions = () => {
  const { address } = useAccount();

  const transactionQuery = `
query MyQuery {
  transactions(
    where: {link: "${address}", sender_not: "0x0000000000000000000000000000000000000000"}
    first: 5
  ) {
    link
    sender
    value
    id
    blockTimestamp
  }
}
`;

  const getTransactions = async () => {
    const { data } = await axios.post(
      `https://api.studio.thegraph.com/query/74190/fastpay/v1`,
      {
        query: transactionQuery,
      }
    );

    return data.data.transactions;
  };

  const { isPending, data: tnxs } = useQuery({
    queryKey: ["tnxs"],
    queryFn: getTransactions,
    enabled: !!address,
  });

  if (isPending) {
    return (
      <div className="flex flex-col gap-y-2">
        <div className="w-full bg-gray-200 animate-pulse rounded-md p-6 h-4"></div>
        <div className="w-full bg-gray-200 animate-pulse rounded-md p-6 h-4"></div>
      </div>
    );
  }

  return (
    <div>
      {tnxs?.length > 0 ? (
        <div className="flex flex-col gap-y-5">
          {tnxs?.map((txn: TransactionType) => (
            <Transaction txn={txn} key={txn.id.toString()} />
          ))}
        </div>
      ) : (
        <div className="text-center px-5 py-10 flex flex-col items-center justify-center gap-y-2 border rounded-lg text-gray-600">
          <Info /> <p>No transactions found</p>
          <Link
            href="/links/create"
            className="bg-black leading-none px-4 py-2 text-white rounded-lg"
          >
            New payment link
          </Link>
        </div>
      )}
    </div>
  );
};
export default Transactions;
