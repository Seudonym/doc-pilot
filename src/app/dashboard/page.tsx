import Navbar from "@/components/navbar-user";
import { auth } from "@/lib/auth";
import { UserIcon } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

const Dashboard = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/register");

  const image = session.user.image ? (
    <Image src={session.user.image} width={24} height={24} alt="" />
  ) : (
    <div className="rounded-full border-2 p-3">
      <UserIcon className="w-6 h-6" />
    </div>
  );

  return (
    <div className="flex flex-col justify-center  text-white">
      <Navbar userImage={image} />
    </div>
  );
};

export default Dashboard;
