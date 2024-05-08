"use client";
import Link from "next/link";
import { ChevronLeft } from "../../../../icons";
import axios from "axios";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Page = () => {
  const { address } = useAccount();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [link, setLink] = useState({
    title: "",
    amount: "",
    description: "",
    website: "",
    isEditable: false,
    type: 0,
  });

  const handleInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setLink((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const createLink = async () => {
    setIsSubmitted(true);
    const { data } = await axios.post("/api/create-link", {
      ...link,
      address,
    });
    return data;
  };

  const { mutate, data, isPending } = useMutation({
    mutationFn: createLink,
    onSuccess: ({ uuid }) => {
      toast("Link created!");
      queryClient.invalidateQueries({ queryKey: ["links"] });
      queryClient.invalidateQueries({ queryKey: ["tnxs"] });
      router.push(`/links/${uuid}`);
    },
  });

  return (
    <section>
      <div className="flex items-center justify-between p-2 mb-2">
        <Link href="/dashboard" className="flex justify-start">
          <ChevronLeft />
        </Link>

        <h3 className="font-bold">New Payment Link</h3>
      </div>

      <div className="flex flex-col gap-y-4 mt-4 border p-4 rounded-lg relative">
        {isSubmitted && (
          <div className="absolute w-full h-full z-20 left-0 top-0 bg-white/80 rounded-lg flex items-center justify-center">
            <span className="loader"></span>
          </div>
        )}

        <div className="flex justify-start items-center gap-x-4">
          <div
            className={`p-4 border rounded-lg cursor-pointer w-full text-center ${
              link?.type == 0 && "bg-black/90 text-white"
            }`}
            onClick={() => setLink((link) => ({ ...link, type: 0 }))}
          >
            One-time
          </div>
          <div
            className={`p-4 border rounded-lg cursor-pointer w-full text-center ${
              link?.type == 1 && "bg-black/90 text-white"
            }`}
            onClick={() => setLink((link) => ({ ...link, type: 1 }))}
          >
            Recurring{" "}
          </div>
        </div>

        <div>
          <div className="flex flex-col">
            <label htmlFor="" className="text-base font-medium text-gray-900">
              Title<sup>*</sup>
            </label>
          </div>
          <div className="mt-2">
            <input
              onChange={(e) => handleInput(e)}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
              type="text"
              name="title"
              placeholder="Base EVM Course"
            ></input>
          </div>
        </div>

        <div>
          <label htmlFor="" className="text-base font-medium text-gray-900">
            Amount<sup>*</sup>
          </label>

          <div className="mt-2">
            <input
              onChange={(e) => handleInput(e)}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
              type="text"
              name="amount"
              placeholder="USDT"
            ></input>
          </div>
        </div>

        <div>
          <label htmlFor="" className="text-base font-medium text-gray-900">
            Website
          </label>

          <div className="mt-2">
            <input
              onChange={(e) => handleInput(e)}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
              type="text"
              name="website"
              placeholder="https://yourwebsite.com"
            ></input>
          </div>
        </div>

        <div>
          <label htmlFor="" className="text-base font-medium text-gray-900">
            Description<sup>*</sup>
          </label>

          <div className="mt-2">
            <textarea
              onChange={(e) => handleInput(e)}
              rows={3}
              className="flex w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
              name="description"
              placeholder="Short and concise"
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            className="border leading-none text-sm px-6 py-4 rounded-lg bg-gray-800 text-white"
            onClick={() => mutate()}
          >
            Create link
          </button>
        </div>
      </div>
    </section>
  );
};
export default Page;
