import { headers } from "next/headers";
import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET)
    throw new Error("Please add WEBHOOK_SECRET from Clerk Dashboard to .env");

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature)
    return new Response("Error occured -- no svix headers", { status: 400 });

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", { status: 400 });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  // console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
  // console.log("Webhook body:", body);

  if (eventType === "user.created") {
    try {
      const jsonBody = JSON.parse(body);

      await prisma.user.create({
        data: {
          clerkId: evt.data.id,
          username: jsonBody.data.username,
          avatar: jsonBody.data.image_url ?? "/noAvatar.png",
          cover: "/noCover.png",
        },
      });
      return new Response("User has been created", { status: 201 });
    } catch (err) {
      console.error("Failed to create user:", err);
      return new Response("Error occured", { status: 500 });
    }
  }

  if (eventType === "user.updated") {
    try {
      const jsonBody = JSON.parse(body);

      await prisma.user.update({
        where: { clerkId: evt.data.id },
        data: {
          username: jsonBody.data.username,
          avatar: jsonBody.data.image_url ?? "/noAvatar.png",
          cover: "/noCover.png",
        },
      });
      return new Response("User has been updated", { status: 200 });
    } catch (err) {
      console.error("Failed to create user:", err);
      return new Response("Error occured", { status: 500 });
    }
  }

  return new Response("Webhook received", { status: 200 });
}
