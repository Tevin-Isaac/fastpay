import { NextResponse } from "next/server";
import resolveUser from "../../../../helpers/resolveUser";
import prisma from "../../../../../prisma";

export const GET = async (
  request: Request,
  { params }: { params: { address: string } }
) => {
  try {
    //resolves user
    const user = await resolveUser(params.address);
    return NextResponse.json({ user });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ msg: "Bad Request" }, { status: 500 });
  }
};

export const PATCH = async (
  request: Request,
  { params }: { params: { address: string } }
) => {
  const { email, username } = await request.json();

  try {
    //resolves user
    const user = await resolveUser(params.address);
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        username: username ?? null,
        email: email ?? null,
      },
    });
    return NextResponse.json(updatedUser);
  } catch (e) {
    console.log(e);
    return NextResponse.json({ msg: "Bad Request" }, { status: 500 });
  }
};
