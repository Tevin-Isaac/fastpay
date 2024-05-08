import { NextResponse } from "next/server";
import resolveUser from "../../../helpers/resolveUser";
import prisma from "../../../../prisma";
import getUniqueId from "../../../helpers/uidGenerator";

export const POST = async (request: Request) => {
  const { title, description, website, type, address, amount } =
    await request.json();

  console.log(address);

  try {
    //resolve user
    const user = await resolveUser(address);
    const uuid = await getUniqueId();

    const link = await prisma.link.create({
      data: {
        title,
        description,
        website,
        amount: parseFloat(amount),
        type,
        address,
        uuid,
        userId: user.id,
      },
    });
    console.log(link);
    return NextResponse.json(link);
  } catch (e) {
    console.log(e);
    return NextResponse.json({ msg: "Bad Request" }, { status: 500 });
  }
};
