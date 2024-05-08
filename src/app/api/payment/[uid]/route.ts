import { NextResponse } from "next/server";
import prisma from "../../../../../prisma";

export const GET = async (
  request: Request,
  { params }: { params: { uid: string } }
) => {
  try {
    const link = await prisma.link.findFirst({
      where: {
        uuid: params.uid,
      },
    });

    return NextResponse.json(link);
  } catch (e) {
    console.log(e);
    return NextResponse.json({ msg: "Bad Request" }, { status: 500 });
  }
};

export const PATCH = async (
  request: Request,
  { params }: { params: { uid: string } }
) => {
  try {
    const link = await prisma.link.update({
      where: {
        uuid: params.uid,
      },
      data: {
        isActive: false,
      },
    });

    return NextResponse.json(link);
  } catch (e) {
    console.log(e);
    return NextResponse.json({ msg: "Bad Request" }, { status: 500 });
  }
};
