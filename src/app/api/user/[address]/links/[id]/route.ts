import { NextResponse } from "next/server";
import resolveUser from "../../../../../../helpers/resolveUser";
import prisma from "../../../../../../../prisma";

export const GET = async (
  request: Request,
  { params }: { params: { address: string; id: string } }
) => {
  try {
    //resolves user
    const user = await resolveUser(params.address);

    const link = await prisma.link.findFirst({
      where: {
        uuid: params.id,
        userId: user.id,
      },
      include: {
        payments: true,
      },
    });
    return NextResponse.json(link);
  } catch (e) {
    console.log(e);
    return NextResponse.json({ msg: "Bad Request" }, { status: 500 });
  }
};
