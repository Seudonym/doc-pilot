import { SendIcon } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex gap-2 items-center">
      <SendIcon className="stroke-2 w-4 h-4 md:w-6 md:h-6 text-purple-400" />
      <span className="font-sans font-bold text-2xl md:text-3xl tracking-tighter">
        DocPilot
      </span>
    </div>
  );
};

export default Logo;
