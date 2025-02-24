"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { PlayCircle, Book, HelpCircle, Library, MoreVertical } from 'lucide-react';
import DataTable from "./WorkflowDataTable";


const infoCards = [
    {
        title: 'Get Started',
        description: 'Learn very basics of how to run & operate workflows',
        icon: <PlayCircle size={24} />,
        color: '#f3f4f6'
    },
    {
        title: 'Tutorial Videos',
        description: 'Learn how to get the most value out of workflows',
        icon: <Book size={24} />,
        color: '#e5f6fd'
    },
    {
        title: 'Help Center',
        description: 'Explore guides and tips for mastering workflows',
        icon: <HelpCircle size={24} />,
        color: '#f0f9ff'
    },
    {
        title: 'Workflow Library',
        description: 'Browse our powerful ready-to-go templates',
        icon: <Library size={24} />,
        color: '#f5f3ff'
    }
];

export default function WorkflowDashboard() {
    const router = useRouter();

    const handleCreateWorkflow = () => {
        // Generate a new unique identifier for the workflow
        const newWorkflowId = uuidv4();
        
        // Navigate to the new workflow's page using the generated ID
        router.push(`/workflows/${newWorkflowId}`);
    };

    return (
        <div>
            <div className="max-w-screen-xl">
                <div>
                    <div className="flex justify-between items-center pb-4 mb-4 border-b">
                        <h1 className="text-2xl font-bold">All Workflows</h1>
                        <button
                            onClick={handleCreateWorkflow}
                            className="bg-black text-white px-4 py-1 rounded hover:bg-gray-800"
                        >
                            Create Workflow
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        {infoCards.map((card, index) => (
                            <div
                                key={index}
                                className="p-4 rounded shadow-sm"
                                style={{ backgroundColor: card.color }}
                            >
                                <div className="flex items-center mb-2">
                                    {card.icon}
                                </div>
                                <h2 className="text-lg font-semibold mb-1">{card.title}</h2>
                                <p className="text-sm text-gray-600">{card.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="py-4">
                <DataTable />
                </div>
            </div>
        </div>
    );
}
