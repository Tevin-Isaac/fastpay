"use client";
import Link from "next/link";
import { ChevronLeft, CloseRound, Edit } from "../../../icons";
import { useAccount } from "wagmi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Settings = () => {
  const { address } = useAccount();
  const [profile, setProfile] = useState({
    email: "",
    username: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const queryClient = useQueryClient();

  const getUser = async () => {
    const { data } = await axios.get(`/api/user/${address}`);

    return data?.user;
  };

  const { isPending: isLoading, data: user } = useQuery({
    queryKey: ["user", address],
    queryFn: getUser,
    enabled: !!address,
  });

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const updateUser = async () => {
    setIsSubmitted(true);
    const { data } = await axios.patch(`/api/user/${address}`, {
      ...profile,
    });

    return data;
  };

  const { mutate, data, isPending } = useMutation({
    mutationFn: updateUser,
    onSuccess: (d) => {
      //TODO: notify user
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast("Details updated");
      setIsEdit(false);
      setTimeout(() => {
        setIsSubmitted(false);
      }, 1000);
    },
  });

  return (
    <section>
      <div className="flex items-center justify-between p-2 mb-2">
        <Link href="/dashboard" className="flex justify-start">
          <ChevronLeft />
        </Link>

        <h3 className="font-bold"> User Prefrence</h3>
      </div>

      <div className="flex flex-col gap-y-4 mt-4 border p-4 rounded-lg relative">
        {isSubmitted && (
          <div className="absolute w-full h-full z-20 left-0 top-0 bg-white/80 rounded-lg flex items-center justify-center">
            <span className="loader"></span>
          </div>
        )}
        <div>
          <div className="flex flex-row justify-between items-center mb-2">
            <label htmlFor="" className="text-base font-medium text-gray-900">
              Username
            </label>
            <div
              className="border rounded-md p-2"
              onClick={() => setIsEdit(!isEdit)}
            >
              {!isEdit ? <Edit /> : <CloseRound />}
            </div>
          </div>
          <div className="mt-2">
            {isEdit ? (
              <input
                onChange={(e) => handleInput(e)}
                className={`flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50`}
                type="text"
                disabled={!isEdit}
                name="username"
                placeholder={user?.username ? user?.username : "Username"}
              ></input>
            ) : (
              <div className="flex h-10 w-full rounded-md border-b border-gray-300 bg-transparent px-3 py-2 text-md font-medium disabled:cursor-not-allowed disabled:opacity-50">
                {user?.username}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex flex-col">
            <label htmlFor="" className="text-base font-medium text-gray-900">
              Email address
            </label>
            <small>* For email notifications only </small>
          </div>
          <div className="mt-2">
            {isEdit ? (
              <input
                onChange={(e) => handleInput(e)}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                type="email"
                name="email"
                disabled={!isEdit}
                placeholder={user?.username ? user?.email : "Email"}
              />
            ) : (
              <div className="flex h-10 w-full rounded-md border-b border-gray-300 bg-transparent px-3 py-2 text-md font-medium disabled:cursor-not-allowed disabled:opacity-50">
                {user?.email}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end min-h-12">
          <button
            className={`${
              !isEdit ? "hidden" : "block"
            } disabled:bg-gray-500 border leading-none text-sm px-6 py-4 rounded-lg bg-gray-800 text-white`}
            onClick={() => mutate()}
          >
            Update
          </button>
        </div>
      </div>
    </section>
  );
};
export default Settings;
