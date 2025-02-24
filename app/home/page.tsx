import React from "react";
import { Workflow, MessageSquare } from "lucide-react";

export default function HomePage() {
  return (
    <div className="mx-auto">
      <h1 className="text-3xl font-bold mb-10">General</h1>
      <div className="flex flex-col md:flex-row gap-6 p-6">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col justify-between p-6 max-w-xs border border-gray-200 rounded-xl shadow-sm bg-white hover:shadow-md transition-all"
          >
            {/* Icon with background */}
            <div className="w-12 h-12 bg-purple-100 flex items-center justify-center rounded-lg mb-4">
              {item.icon}
            </div>
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-gray-600 mb-4">{item.description}</p>
            <a
              href={item.link}
              className="bg-black w-fit text-white py-2 px-5 rounded-lg font-semibold hover:bg-gray-900 transition"
            >
              {item.buttonText}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

const items = [
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: "Chat",
    description: "Chat is an AI assistant for daily tasks including writing, brainstorming, and research.",
    buttonText: "Chat with AI",
    link: "/chats",
  },
  {
    icon: <Workflow className="h-6 w-6" />,
    title: "Workflow",
    description: "Scale automated, repetitive tasks with customizable workflows.",
    buttonText: "Create Workflow",
    link: "/workflows",
  },
];
