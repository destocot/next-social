import { getUserFromClerkId } from "@/lib/server-utils";
import { NextResponse } from "next/server";

export async function GET() {
  const currentUser = await getUserFromClerkId();

  return NextResponse.json({ data: currentUser });
}
