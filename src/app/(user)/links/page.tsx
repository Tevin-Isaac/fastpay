"use client";

import { useState } from "react";
import { ChevronLeft, Info } from "../../../icons";
import Link from "next/link";
import { useAccount } from "wagmi";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import LinkBox from "../../../components/LinkBox";
import { useRouter } from "next/navigation";
import { Link as LinkType } from "@prisma/client";

const Page = ({ params }: { params: { id: string } }) => {
  const [selected, setSelected] = useState("single");
  const { address } = useAccount();

  const getLinks = async () => {
    if (typeof address === "undefined") {
      return null;
    }

    const { data } = await axios.get(`/api/user/${address}/links`);

    return data;
  };

  const { isPending, data: links } = useQuery({
    queryKey: ["links", address],
    queryFn: getLinks,
  });

  console.log(links);
  const oneTime = links?.filter((link: LinkType) => link?.type == 0);
  const recurring = links?.filter((link: LinkType) => link?.type == 1);

  console.log(oneTime);
  console.log(recurring);

  return (
    <section>
      <div className="flex items-center justify-between p-2 ">
        <Link href="/dashboard" className="flex justify-start">
          <ChevronLeft />
        </Link>

        <h3 className="font-bold">My Payment Links</h3>
      </div>

      <div className="border p-4 mt-3 rounded-md">
        <div className="flex items-center justify-between mb-6">
          <p
            className={`${
              selected == "single"
                ? "border-b-2 border-b-gray-400 font-medium"
                : ""
            }  w-1/2 p-2 pb-3 flex justify-center border-b cursor-pointer`}
            onClick={() => setSelected("single")}
          >
            <span>One-Time links</span>
          </p>
          <p
            className={`${
              selected == "donation"
                ? "border-b-2 border-b-gray-400 font-medium"
                : ""
            }  w-1/2 p-2 pb-3 flex justify-center border-b  cursor-pointer`}
            onClick={() => setSelected("donation")}
          >
            <span>Donations links</span>
          </p>
        </div>

        {selected == "single" ? (
          isPending ? (
            <div className="flex flex-col gap-y-2">
              <div className="w-full bg-gray-200 animate-pulse rounded-md p-6 h-4"></div>
              <div className="w-full bg-gray-200 animate-pulse rounded-md p-6 h-4"></div>
            </div>
          ) : oneTime?.length > 0 ? (
            <div className="flex flex-col gap-y-4">
              {oneTime.map((link: LinkType) => (
                <LinkBox key={link?.id} link={link} />
              ))}
            </div>
          ) : (
            <div className="text-center px-5 py-10 flex flex-col items-center justify-center gap-y-2 border rounded-lg text-gray-600">
              <Info /> <p>No links found</p>
              <Link
                href="/links/create"
                className="bg-black leading-none px-4 py-2 text-white rounded-lg"
              >
                New payment link
              </Link>
            </div>
          )
        ) : isPending ? (
          <div className="flex flex-col gap-y-2">
            <div className="w-full bg-gray-200 animate-pulse rounded-md p-6 h-4"></div>
            <div className="w-full bg-gray-200 animate-pulse rounded-md p-6 h-4"></div>
          </div>
        ) : recurring?.length > 0 ? (
          <div className="flex flex-col gap-y-4">
            {recurring.map((link: LinkType) => (
              <LinkBox key={link?.id} link={link} />
            ))}
          </div>
        ) : (
          <div className="text-center px-5 py-10 flex flex-col items-center justify-center gap-y-2 border rounded-lg text-gray-600">
            <Info /> <p>No links found</p>
            <Link
              href="/links/create"
              className="bg-black leading-none px-4 py-2 text-white rounded-lg"
            >
              New payment link
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
export default Page;
