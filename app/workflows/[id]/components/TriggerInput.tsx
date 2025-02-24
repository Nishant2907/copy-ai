"use client";
import { Trash } from "lucide-react"; // Importing necessary icons
import { Bolt } from "@mui/icons-material";

interface TriggerInputProps {
  id: string;
  name: string;
  description: string;
  onEdit: () => void;
  onDelete: (id: string) => void;
}

export default function TriggerInput({ id, name, description, onEdit, onDelete }: TriggerInputProps) {
  return (
    <div
      className="p-4 mb-2 relative cursor-pointer bg-white shadow-md rounded-lg border border-gray-200 hover:shadow-lg transition-all"
      onClick={onEdit}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className="w-10 h-10 flex items-center justify-center bg-yellow-100 rounded-full">
          <Bolt className="text-yellow-600 w-5 h-5" />
        </div>

        {/* Text Section */}
        <div className="flex-1 overflow-hidden">
          <p className="text-lg font-semibold text-black">Input</p>
          <p className="text-sm font-semibold text-gray-700">{name}</p>
          <p className="text-xs text-gray-500 truncate">{description}</p>
        </div>

        {/* Delete Button */}
        <button
          className="ml-auto p-2 rounded-full text-gray-600 hover:bg-gray-200 transition-all"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
        >
          <Trash className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

