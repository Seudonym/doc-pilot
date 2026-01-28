import Navbar from "@/components/navbar-user";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Card from "@/components/dashboard-card";

const Dashboard = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/register");

  return (
    <div className="flex flex-col justify-center  text-white">
      <Navbar />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 my-12 mx-8 md:mx-16 xl:mx-28">
        <Card
          emoji="🙂"
          title="Genetic Engineering"
          date={new Date()}
          numSources={4}
        />
        <Card
          emoji="🙂"
          title="Genetic Engineering LMFAOO"
          date={new Date()}
          numSources={4}
        />
      </div>
    </div>
  );
};

export default Dashboard;
