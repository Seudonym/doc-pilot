import Navbar from "@/components/navbar-user";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Card from "@/components/dashboard-card";
import Link from "next/link";
import CreateLibraryCard from "@/components/create-library-card";

const Dashboard = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/register");

  const libraries = await prisma.library.findMany({
    where: { userId: session.user.id },
    include: {
      _count: {
        select: { sources: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="flex flex-col justify-center  text-white">
      <Navbar />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 my-12 mx-8 md:mx-16 xl:mx-28">
        <CreateLibraryCard />
        {libraries.map((lib) => (
          <Link href={`/library/${lib.id}`} key={lib.id}>
            <Card
              id={lib.id}
              emoji="📚"
              title={lib.name}
              date={lib.updatedAt}
              numSources={lib._count.sources}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
