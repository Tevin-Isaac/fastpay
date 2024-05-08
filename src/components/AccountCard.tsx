"use client";
import { useAccount } from "wagmi";
import { User } from "../icons";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { formatEther } from "viem";

const AccountCard = () => {
  const { address, isConnecting } = useAccount();

  const getUser = async () => {
    const { data } = await axios.get(`/api/user/${address}`);

    return data?.user;
  };

  const { isPending: isLoading, data: user } = useQuery({
    queryKey: ["user", address],
    queryFn: getUser,
    enabled: !!address,
  });

  const transactionQuery = `
query MyQuery {
  transactions(
    where: {link: "${address}", sender_not: "0x0000000000000000000000000000000000000000"}
    first: 5
  ) {
    value
  }
}
`;

  const getTotalPayments = async () => {
    const { data } = await axios.post(
      `https://api.studio.thegraph.com/query/74190/fastpay/v1`,
      {
        query: transactionQuery,
      }
    );

    // Extract the transactions array from the data
    const transactions = data.data.transactions;

    // Calculate the sum of the `value` field
    const totalValue = transactions.reduce(
      (sum: number, transaction: number) => {
        //@ts-ignore Convert the value from string to number
        const value = parseFloat(formatEther(transaction?.value));
        return sum + value;
      },
      0
    );

    return totalValue;
  };

  const { isPending, data: totalpayments } = useQuery({
    queryKey: ["payments", address],
    queryFn: getTotalPayments,
    enabled: !!address,
  });

  return (
    <div className="flex items-center justify-between px-4 py-5 rounded-md min-h-24 border-2 border-black/60">
      <div className="flex items-center gap-x-2 w-[50%]">
        <User />
        <div className="w-[40%]">
          {isConnecting ? (
            <span className="inline-block bg-gray-200 animate-pulse rounded-md h-[12px]"></span>
          ) : (
            <span>{user?.username || "Guest"}</span>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="min-h-10 w-full flex items-end justify-end">
          {isPending ? (
            <div className="w-[90%] bg-gray-200 animate-pulse rounded-md h-5"></div>
          ) : (
            <p className="text-xl font-bold">
              ${totalpayments}
              {totalpayments > 0 && "+"}
            </p>
          )}
        </div>

        <small> received so far</small>
      </div>
    </div>
  );
};
export default AccountCard;
