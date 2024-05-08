"use client";
import Link from "next/link";
import Badge from "../../../../components/Badge";
import {
  External,
  Copy,
  Edit,
  ChevronLeft,
  Info,
  Paid,
} from "../../../../icons";
import Image from "next/image";
import qr from "../../../../../public/img/qr.png";
import { useState } from "react";
import { useAccount } from "wagmi";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "../../../../helpers";
import Payment from "../../../../components/Payment";
import toast from "react-hot-toast";

const LinkPage = ({ params }: { params: { id: string } }) => {
  const [selected, setSelected] = useState("info");

  const { address } = useAccount();

  const getLink = async () => {
    const { data } = await axios.get(
      `/api/user/${address}/links/${params?.id}`
    );
    console.log(data);
    return data;
  };

  const { isPending, data: link } = useQuery({
    queryKey: ["single"],
    queryFn: getLink,
    enabled: !!address,
  });

  const copyLink = () => {
    navigator.clipboard
      .writeText(`https://fastpay.xyz/p/${link?.uuid}`)
      .then(() => {
        toast("Link Copied!");
      });
  };

  //TODO: Payments from GraphQL

  return (
    <section>
      <div>
        <div className="flex items-center justify-between p-2 mb-2">
          <Link href="/links" className="flex justify-start">
            <ChevronLeft />
          </Link>

          <div className="flex items-center justify-end gap-x-2 w-[50%]">
            {isPending ? (
              <div className="bg-gray-200 rounded-md w-[75%] h-7 border-2 animate-pulse"></div>
            ) : (
              <span className="font-medium text-lg">{link?.title}</span>
            )}
            {link?.status == "live" && (
              <div className="p-2 border rounded-md">
                <Edit />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-y-4 border p-4 rounded-md">
          <div className="flex min-h-[150px] lg:h-auto items-center justify-between border rounded-lg bg-gray-50 px-4 py-8">
            {isPending ? (
              <div className="bg-gray-200 rounded-md leading-none w-[25%] h-5 py-[6px] text-xs border-2 animate-pulse"></div>
            ) : (
              <Badge label={`${link?.type == 0 ? "One-time" : "Recurring"}`} />
            )}

            <div className="flex flex-col items-end gap-y-1 w-[60%]">
              {isPending ? (
                <div className="flex flex-col items-end gap-y-1 w-full">
                  <div className="bg-gray-200 rounded-md leading-none w-[25%] h-4 py-[6px] text-xs border-2 animate-pulse"></div>
                  <div className="bg-gray-200 rounded-md leading-none w-[45%] h-4 py-[6px] text-xs border-2 animate-pulse"></div>
                </div>
              ) : (
                <div className="flex flex-col items-end gap-y-1 lg:w-full">
                  <span className="text-xl font-bold">${link?.amount}</span>
                  <span className="text-xs">{formatDate(link?.createdAt)}</span>
                  {link?.website && (
                    <a
                      href={link?.website}
                      target="_blank"
                      className="flex items-center gap-x-1 p-1 cursor-pointer"
                    >
                      <span className="underline"> visit website </span>
                      <div className="w-3 h-3">
                        <External />
                      </div>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between ">
            <p
              className={`${
                selected == "info"
                  ? "border-b-2 border-b-gray-400 font-medium"
                  : ""
              }  w-1/2 p-2 pb-3 flex justify-center border-b cursor-pointer`}
              onClick={() => setSelected("info")}
            >
              <span>Info</span>
            </p>
            <p
              className={`${
                selected == "payment"
                  ? "border-b-2 border-b-gray-400 font-medium"
                  : ""
              }  w-1/2 p-2 pb-3 flex justify-center border-b items-center cursor-pointer`}
              onClick={() => setSelected("payment")}
            >
              <span>{`Payment${link?.type == 1 ? "s" : ""}`}</span>
              {link?.payments?.length > 0 && <Paid />}
            </p>
          </div>

          <div className="lg:min-h-[200px]">
            {selected == "info" ? (
              <div className="lg:border rounded p-4">
                <div>
                  <div className="w-[60%] lg:w-[150px] mx-auto">
                    <Image src={qr} alt="payment link qr code" />
                  </div>

                  <div className="text-center flex items-center justify-center gap-x-2">
                    {isPending ? (
                      <div className="bg-gray-200 rounded-md leading-none w-[60%] h-5 py-[6px] text-xs border-2 animate-pulse"></div>
                    ) : (
                      <div className="text-center flex items-center justify-center gap-x-2">
                        <span className="text-sm">
                          {`https://fastpay.xyz/p/${link?.uuid}`}
                        </span>
                        <div
                          className="border p-1 rounded-md"
                          onClick={() => copyLink()}
                        >
                          <Copy />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-y-4 p-2 mt-3">
                  <div>
                    {isPending ? (
                      <div className="flex flex-col gap-y-4">
                        <div className="bg-gray-200 rounded-md leading-none w-full h-6 py-[6px] text-xs border-2 animate-pulse"></div>
                        <div className="bg-gray-200 rounded-md leading-none w-full h-6 py-[6px] text-xs border-2 animate-pulse"></div>
                        <div className="bg-gray-200 rounded-md leading-none w-full h-6 py-[6px] text-xs border-2 animate-pulse"></div>
                      </div>
                    ) : (
                      <div className="mb-5 flex flex-col gap-y-2 text-center">
                        <p>{link?.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {isPending ? (
                  <div className="flex flex-col gap-y-2">
                    <div className="w-full bg-gray-200 animate-pulse rounded-md p-6 h-4"></div>
                    <div className="w-full bg-gray-200 animate-pulse rounded-md p-6 h-4"></div>
                  </div>
                ) : link?.payments?.length > 0 ? (
                  link?.payments.map((payment: any) => (
                    <Payment
                      key={payment.id}
                      payment={payment}
                      amount={link?.amount}
                    />
                  ))
                ) : (
                  <div className="text-center px-5 py-10 flex flex-col items-center justify-center gap-y-2 border rounded-lg text-gray-600">
                    <Info /> <p>No payment yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
export default LinkPage;
