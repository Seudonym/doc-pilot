"use client";
import { EllipsisVerticalIcon } from "lucide-react";
import ContextMenuButton from "./context-menu-button";
import { deleteLibrary } from "@/app/dashboard/actions";

const Card = ({
  id,
  emoji,
  title,
  date,
  numSources,
}: {
  id: string;
  emoji: string;
  title: string;
  date: Date;
  numSources: number;
}) => {
  const month = date.toLocaleString("default", { month: "short" }).toString();
  const day = date.getDay().toString();
  const year = date.getFullYear().toString();
  const formattedDate = `${month} ${day}, ${year}`;

  const handleDelete = async () => {
    try {
      await deleteLibrary(id);
    } catch (error) {
      console.error("Failed to delete library:", error);
    }
  };

  const menuItems = [
    { label: "Delete", variant: "danger" as const, onClick: handleDelete },
  ];
  return (
    <div
      tabIndex={0}
      className="flex flex-col z-0 justify-between rounded-lg p-10 bg-purple-900/30 h-60 cursor-pointer hover:scale-105 transition-transform hover:border border-purple-400 hover:shadow-md shadow-purple-600"
    >
      <div className="flex justify-between items-center mb-6">
        <span className="text-5xl">{emoji}</span>
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <ContextMenuButton
            icon={<EllipsisVerticalIcon className="btn-back" />}
            items={menuItems}
          />
        </div>
      </div>
      <div className="flex flex-col">
        <h2 className="font-medium text-2xl mb-2 text-ellipsis line-clamp-2 max-w-3/4">
          {title}
        </h2>
        <p className="text-sm text-white/80">
          {formattedDate + " \u00b7 " + numSources + " sources"}
        </p>
      </div>
    </div>
  );
};

export default Card;
