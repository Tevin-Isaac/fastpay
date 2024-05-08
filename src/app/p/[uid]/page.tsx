"use client";
import { External, Paid } from "../../../icons";
import pattern from "../../../../public/img/pattern.jpg";
import Image from "next/image";
import {
  useAccount,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useReadContract,
  useWriteContract,
} from "wagmi";
import axios from "axios";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import usdt from "../../../constants/usdt";
import { formatEther, parseEther } from "viem";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useWindowSize } from "@uidotdev/usehooks";
import Confetti from "react-confetti";

const Page = ({ params }: { params: { uid: string } }) => {
  //for submission ux
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hash, setHash] = useState("");

  const { address, isConnected } = useAccount();

  const { width, height } = useWindowSize();

  const queryClient = useQueryClient();

  const { writeContract } = useWriteContract();

  //get payment link details
  const getPayment = async () => {
    const { data } = await axios.get(`/api/payment/${params?.uid}`);

    return data;
  };

  const { isPending, data: link } = useQuery({
    queryKey: ["uid", params],
    queryFn: getPayment,
    enabled: !!params,
  });

  //simulate contract
  const { data, failureReason } = useSimulateContract({
    account: address,
    abi: usdt?.abi,
    //@ts-ignore
    address: usdt?.address,
    functionName: "transfer",
    args: [link?.address, parseEther(link?.amount?.toString() || "0")],
    query: {
      enabled: !!address,
    },
  });

  failureReason && console.log(failureReason);

  //handle contract write
  const handleSubmit = () => {
    setIsSubmitted(true);

    //make transfer
    writeContract(data!.request, {
      onSuccess: (hash) => {
        setHash(hash);
        toast(`Thanks for your payment!`, { duration: 6000 });
        setIsSuccess(true);
      },
    });
  };

  const { status } = useWaitForTransactionReceipt({
    confirmations: 1,
    //@ts-ignore
    hash,
    query: {
      enabled: !!hash,
    },
  });

  const updateLinkPayment = async () => {
    const { data } = await axios.patch(`/api/payment/${params?.uid}`, {
      txn_hash: hash,
    });
    return data;
  };

  const { mutate } = useMutation({
    mutationFn: updateLinkPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["uid"] });
    },
  });

  //fires when transaction is successful
  useEffect(() => {
    if (status === "success") {
      setIsSubmitted(false);
      mutate();
    }
  }, [status]);

  return (
    <div className="p-4 lg:p-0">
      {isSuccess && (
        <Confetti
          //@ts-ignore
          width={width}
          //@ts-ignore
          height={height}
          recycle={false}
          numberOfPieces={600}
        />
      )}

      <div className="flex flex-col gap-y-4 border px-4 pt-4 pb-8 rounded-3xl shadow-md relative lg:max-w-[400px] lg:mx-auto">
        {isSubmitted && (
          <div className="absolute w-full h-full z-10 left-0 top-0 bg-white/80 rounded-lg flex items-center justify-center">
            <span className="loader"></span>
          </div>
        )}
        <div className="lg:min-h-2 rounded-lg overflow-hidden relative">
          <div className="absolute right-2 top-4 shadow-lg font-medium bg-gray-200 rounded-lg leading-none w-[100px] px-3 py-[6px] text-sm text-center border-2">
            {isPending ? (
              <div className="bg-gray-200 rounded-md w-[20%] h-3 border-2 animate-pulse"></div>
            ) : link?.type == "single" ? (
              "One-Time"
            ) : (
              "Donation"
            )}
          </div>
          <div className="w-full">
            <Image
              src={pattern}
              alt="black and white pattern"
              className="z-0"
            />
          </div>
        </div>

        <div className="border-b pb-2">
          {isPending ? (
            <div className="bg-gray-200 rounded-md w-full h-7 border-2 animate-pulse"></div>
          ) : (
            <div className="flex items-center justify-between">
              <span>
                {link?.website && (
                  <a
                    href={link?.website}
                    target="_blank"
                    className="flex items-center gap-x-1 p-1 cursor-pointer"
                  >
                    <span className="underline"> more info </span>
                    <External />
                  </a>
                )}
              </span>
              <div className="flex items-center gap-x-2">
                {link?.type == "single" && link?.status == "2" && <Paid />}
                <span className="font-medium text-xl">${link?.amount}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col min-h-[8]">
          {isPending ? (
            <div className="bg-gray-200 rounded-md w-[75%] h-7 border-2 animate-pulse"></div>
          ) : (
            <h3 className="text-2xl font-bold text-center">{link?.title}</h3>
          )}
        </div>

        <div className="min-h-7">
          {isPending ? (
            <div className="flex flex-col gap-y-2">
              <div className="bg-gray-200 rounded-md w-full h-7 border-2 animate-pulse"></div>
              <div className="bg-gray-200 rounded-md w-full h-7 border-2 animate-pulse"></div>{" "}
              <div className="bg-gray-200 rounded-md w-full h-7 border-2 animate-pulse"></div>{" "}
            </div>
          ) : (
            <p className="text-gray-700 leading-7 text-center">
              {link?.description}
            </p>
          )}
        </div>

        <div className="flex justify-center mt-4">
          {isConnected ? (
            <button
              disabled={!!hash}
              className="bg-black/90 leading-none px-5 py-4 rounded-md text-white disabled:bg-gray-300"
              onClick={() => handleSubmit()}
            >
              Make payment
            </button>
          ) : (
            <ConnectButton />
          )}
        </div>
      </div>

      <div className="flex items-center justify-center text-gray-400 mt-2">
        <small>
          this payment link was generated using{" "}
          <a href="https://fastpay.vercel.app" className="underline">
            FastPay
          </a>
        </small>
      </div>
    </div>
  );
};
export default Page;
