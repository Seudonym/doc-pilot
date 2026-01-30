"use client";
import { PlusIcon, XIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { createLibrary } from "@/app/dashboard/actions";

export default function CreateLibraryCard() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsLoading(true);
    try {
      await createLibrary(name);
      setName("");
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
        setIsEditing(false);
    }
  }

  if (isEditing) {
    return (
      <div 
        className="flex flex-col z-0 justify-between rounded-lg p-6 bg-purple-900/30 h-60 border border-purple-400 shadow-purple-600 animate-in fade-in zoom-in-95 duration-200"
        onKeyDown={handleKeyDown}
      >
        <form onSubmit={handleSubmit} className="flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
                <span className="text-lg font-medium text-white">New Library</span>
                <button 
                    type="button" 
                    onClick={() => setIsEditing(false)} 
                    disabled={isLoading}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                    <XIcon className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>
            </div>
            <div className="flex flex-col gap-3">
                <input
                    autoFocus
                    type="text"
                    placeholder="e.g. Research Papers"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-purple-950/50 border border-purple-500/50 rounded-md p-3 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !name.trim()}
                    className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-purple-600/50 disabled:cursor-not-allowed text-white rounded-md p-2 font-medium transition-colors flex justify-center items-center h-10"
                >
                    {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "Create Library"}
                </button>
            </div>
        </form>
      </div>
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsEditing(true);
        }
      }}
      className="flex flex-col z-0 justify-center items-center rounded-lg p-10 bg-purple-900/10 h-60 cursor-pointer hover:scale-[1.02] transition-all hover:border border-dashed border-2 border-purple-400/30 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-600/20 group"
    >
        <div className="bg-purple-500/10 p-4 rounded-full group-hover:bg-purple-500/20 transition-colors mb-4 border border-purple-500/20 group-hover:border-purple-500/40">
            <PlusIcon className="w-8 h-8 text-purple-200/80 group-hover:text-purple-100 transition-colors" />
        </div>
        <span className="font-medium text-lg text-purple-200/80 group-hover:text-purple-100 transition-colors">Create New Library</span>
    </div>
  );
}
