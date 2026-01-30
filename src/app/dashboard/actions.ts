"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createLibrary(name: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  await prisma.library.create({
    data: {
      name,
      userId: session.user.id,
    },
  });

  revalidatePath("/dashboard");
}

export async function deleteLibrary(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  // Verify ownership before deleting
  const library = await prisma.library.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!library) throw new Error("Library not found or unauthorized");

  await prisma.library.delete({
    where: { id },
  });

  revalidatePath("/dashboard");
}
