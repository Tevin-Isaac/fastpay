import Link from "next/link";
import { LinkIcon } from "../icons";
import Badge from "./Badge";
import { formatDate } from "../helpers";
import { Link as LinkType } from "@prisma/client";

const LinkBox = ({ link }: { link: LinkType }) => {
  return (
    <Link href={`/links/${link?.uuid}`} className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
        <div className="flex flex-col gap-y-1">
          <div className="flex gap-x-2 justify-start items-center">
            <div className="flex flex-col items-start justify-start gap-x-2"></div>
          </div>
          <Badge label={link?.isActive ? "Awaiting payment" : "closed"} />
        </div>
        <div className="flex flex-col gap-x-2">
          <div className="flex items-center justify-end gap-x-2">
            <p className="text-sm">{link?.title}</p>
            <LinkIcon />
          </div>
          <small className=" text-gray-900">
            {formatDate(link?.createdAt?.toString())}
          </small>
        </div>
      </div>
    </Link>
  );
};
export default LinkBox;
