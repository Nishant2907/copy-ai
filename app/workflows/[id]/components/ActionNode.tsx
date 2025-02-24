"use client";
import { Sparkles, Trash } from 'lucide-react';

interface ActionNodeProps {
  prompt: string;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ActionNode({ prompt, index, onEdit, onDelete }: ActionNodeProps) {
  return (
    <div
      className="p-4 mb-2 relative cursor-pointer bg-white shadow-md rounded-lg border border-gray-200 hover:shadow-lg transition-all"
      onClick={onEdit}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full">
          <Sparkles className="text-blue-600 w-5 h-5" />
        </div>
        {/* Text Section */}
        <div className="flex-1 overflow-hidden">
          <p className="text-lg font-semibold text-black">Generate Text</p>
          <p className="text-sm font-semibold text-gray-700 truncate">{prompt}</p>
        </div>

        {/* Delete Button */}
        <button
          className="ml-auto p-2 rounded-full text-gray-600 hover:bg-gray-200 transition-all"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}