"use client";

import { useState } from "react";
import {
    Button,
    Drawer,
    Typography,
    Tabs,
    Tab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from "@mui/material";
import { Add, Close, PlayArrow, TableChart, Bolt } from "@mui/icons-material";
import { Sparkles } from 'lucide-react';

import TriggerInput from "./components/TriggerInput";
import ActionNode from "./components/ActionNode";
import TriggerDrawer from "./components/TriggerDrawer";
import ActionDrawer from "./components/ActionDrawer";

// Types
interface TriggerInput {
    id: string;
    name: string;
    description: string;
}

interface Action {
    id: string;
    prompt: string;
    backgroundData: string;
}

interface WorkflowRun {
    inputs: Record<string, string>;
    results: string[];
}

interface SavedWorkflow {
    triggerInputs: TriggerInput[];
    actions: Action[];
}

export default function WorkflowEditor({ id }: { id: string }) {
    // export default function WorkflowEditor({ params }: { params: { id: string } }) {
    // State
    const [activeTab, setActiveTab] = useState(0);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [drawerType, setDrawerType] = useState<"trigger" | "action" | null>(null);
    const [triggerInputs, setTriggerInputs] = useState<TriggerInput[]>([]);
    const [actions, setActions] = useState<Action[]>([]);
    const [selectedActionIndex, setSelectedActionIndex] = useState<number | null>(null);
    const [selectedTriggerInput, setSelectedTriggerInput] = useState<TriggerInput | null>(null);
    const [workflowRun, setWorkflowRun] = useState<WorkflowRun | null>(null);
    const [runInputValues, setRunInputValues] = useState<Record<string, string>>({});
    const [savedWorkflow, setSavedWorkflow] = useState<SavedWorkflow | null>(null);
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [pendingTabChange, setPendingTabChange] = useState<number | null>(null);
    const [insertPosition, setInsertPosition] = useState<number | null>(null);

    // Handlers
    // Check if there are unsaved changes in the workflow
    const hasUnsavedChanges = () => {
        if (!savedWorkflow) return triggerInputs.length > 0 || actions.length > 0;

        return JSON.stringify({ triggerInputs, actions }) !==
            JSON.stringify({
                triggerInputs: savedWorkflow.triggerInputs,
                actions: savedWorkflow.actions
            });
    };

    // Handle tab change with a check for unsaved changes
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        if (hasUnsavedChanges() && activeTab === 0) {
            setShowSaveDialog(true); // Show dialog if there are unsaved changes
            setPendingTabChange(newValue); // Store the new tab value to change later
        } else {
            setActiveTab(newValue); // Change tab immediately if no unsaved changes
        }
    };

    // Handle closing of the save dialog
    const handleSaveDialogClose = (shouldSave: boolean) => {
        setShowSaveDialog(false);

        if (shouldSave) {
            handlePublish(); // Save changes if user chooses to save
        } else {
            // Revert to saved state if user chooses not to save
            if (savedWorkflow) {
                setTriggerInputs(savedWorkflow.triggerInputs);
                setActions(savedWorkflow.actions);
            } else {
                setTriggerInputs([]);
                setActions([]);
            }
        }

        if (pendingTabChange !== null) {
            setActiveTab(pendingTabChange); // Change to the pending tab
            setPendingTabChange(null);
        }
    };

    // Open drawer to add a new trigger input
    const handleAddTrigger = () => {
        setDrawerType("trigger");
        setSelectedTriggerInput(null); // No trigger selected for editing
        setIsDrawerOpen(true); // Open the drawer
    };

    // Open drawer to edit an existing trigger input
    const handleEditTrigger = (trigger: TriggerInput) => {
        setDrawerType("trigger");
        setSelectedTriggerInput(trigger); // Set the trigger to be edited
        setIsDrawerOpen(true); // Open the drawer
    };

    // Open drawer to add a new action
    const handleAddAction = (index?: number) => {
        setDrawerType("action");
        setSelectedActionIndex(null); // No action selected for editing
        setInsertPosition(index ?? null); // Set position for new action
        setIsDrawerOpen(true); // Open the drawer
    };

    // Open drawer to edit an existing action
    const handleEditAction = (action: Action, index: number) => {
        setDrawerType("action");
        setSelectedActionIndex(index); // Set the action to be edited
        setInsertPosition(null); // No specific insert position
        setIsDrawerOpen(true); // Open the drawer
    };

    // Add or update a trigger input
    const handleAddInput = (input: { name: string; description: string }) => {
        if (selectedTriggerInput) {
            // Update existing trigger input
            setTriggerInputs(triggerInputs.map(ti =>
                ti.id === selectedTriggerInput.id
                    ? { ...ti, ...input } // Update the selected trigger input
                    : ti
            ));
        } else {
            // Add new trigger input
            const newTriggerInput = {
                id: Math.random().toString(36).substr(2, 9), // Generate a random ID
                ...input,
            };
            setTriggerInputs([...triggerInputs, newTriggerInput]); // Add to the list
        }
        setIsDrawerOpen(false); // Close the drawer
        setSelectedTriggerInput(null); // Clear selected trigger input
    };

    // Delete a trigger input by ID
    const handleDeleteInput = (inputId: string) => {
        setTriggerInputs(triggerInputs.filter(input => input.id !== inputId)); // Remove from list
    };

    // Add or update an action
    const handleAddGenerateText = (action: { prompt: string; backgroundData: string }) => {
        if (selectedActionIndex !== null && actions[selectedActionIndex]) {
            // Update existing action
            const newActions = [...actions];
            newActions[selectedActionIndex] = {
                ...newActions[selectedActionIndex],
                ...action // Update the selected action
            };
            setActions(newActions);
        } else {
            // Add new action
            const newAction = {
                id: Math.random().toString(36).substr(2, 9), // Generate a random ID
                ...action,
            };
            const newActions = [...actions];
            if (insertPosition !== null) {
                // Insert at specific position
                newActions.splice(insertPosition, 0, newAction);
            } else {
                // Add to end
                newActions.push(newAction);
            }
            setActions(newActions);
        }
        setIsDrawerOpen(false); // Close the drawer
        setSelectedActionIndex(null); // Clear selected action index
        setInsertPosition(null); // Clear insert position
    };

    // Delete an action by index
    const handleDeleteAction = (index: number) => {
        const newActions = [...actions];
        newActions.splice(index, 1); // Remove action from list
        setActions(newActions);
    };

    // Save the current workflow
    const handlePublish = () => {
        const workflow = {
            triggerInputs,
            actions,
        };
        setSavedWorkflow(workflow); // Save the workflow
        setActiveTab(1); // Switch to the "Run" tab
    };

    // Run the workflow with the current inputs
    const handleRunWorkflow = async () => {
        if (triggerInputs.length === 0) return; // Exit if no inputs

        const processedActions = actions.map(action => {
            let processedPrompt = action.prompt;
            triggerInputs.forEach(input => {
                const placeholder = `#{${input.name}}`;
                const value = runInputValues[input.id] || '';
                processedPrompt = processedPrompt.split(placeholder).join(value); // Replace placeholders with input values
            });
            return processedPrompt;
        });

        const promptList = processedActions.map((prompt, index) => {
            const input = triggerInputs[index] ? runInputValues[triggerInputs[index].id] || '' : '';
            return {
                id: index + 1,
                use_input: index,
                prompt,
                Input: input,
                Background_prompt: actions[index].backgroundData,
            };
        });

        console.log("promptList", promptList);
        try {
            const response = await fetch('https://ai.enttlevo.online/gpt/hit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ promptList }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const results = data.content ? [data.content] : [];
            console.log("results", results);
            setWorkflowRun({
                inputs: runInputValues,
                results,
            });
        } catch (error) {
            console.error('Error running workflow:', error);
        }
    };

    // Determine if the workflow can be published
    const canPublish = (triggerInputs.length > 0 && actions.length > 0) && (savedWorkflow === null ||
        (JSON.stringify(triggerInputs) !== JSON.stringify(savedWorkflow.triggerInputs) ||
            JSON.stringify(actions) !== JSON.stringify(savedWorkflow.actions)));

    return (
        <div className="max-w-7xl mx-auto">
            <div className="border-b border-gray-300 mb-3">

                <Tabs value={activeTab} onChange={handleTabChange}>
                    <Tab label="Build" />
                    <Tab label="Run" />
                    <Tab label="Table" />
                </Tabs>
            </div>

            {activeTab === 0 && (
                <>
                    <div className="flex justify-between mb-2">
                        <h5 className="text-xl font-semibold">New Workflow</h5>
                        <button
                            className={`px-4 py-2 text-white rounded ${canPublish ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
                                }`}
                            disabled={!canPublish}
                            onClick={handlePublish}
                        >
                            Publish
                        </button>
                    </div>

                    <div className="min-h-[70vh] border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col gap-2">
                        <div className="w-full max-w-md mx-auto">
                            {triggerInputs.map((input) => (
                                <TriggerInput
                                    key={input.id}
                                    {...input}
                                    onEdit={() => handleEditTrigger(input)}
                                    onDelete={handleDeleteInput}
                                />
                            ))}
                            <button
                                className="w-full h-24 border border-gray-400 rounded-lg flex items-center justify-center hover:bg-gray-100"
                                onClick={handleAddTrigger}
                            >
                                <Add className="mr-2" /> Add Input
                            </button>
                        </div>

                        {triggerInputs.length > 0 && (
                            <div className="flex flex-col gap-2">
                                {actions.map((action, index) => (
                                    <div key={action.id} className="relative w-full max-w-md mx-auto flex flex-col gap-2">
                                        <div className="w-full flex justify-center">
                                            <button
                                                className="bg-gray-200 p-2 w-fit rounded-full hover:bg-gray-300"
                                                onClick={() => handleAddAction(index)}
                                            >
                                                <Add />
                                            </button>
                                        </div>
                                        <ActionNode
                                            prompt={action.prompt}
                                            index={index}
                                            onEdit={() => handleEditAction(action, index)}
                                            onDelete={() => handleDeleteAction(index)}
                                        />
                                    </div>
                                ))}
                                <button className="w-fit mx-auto px-4 py-2 border border-gray-400 rounded hover:bg-gray-100" onClick={() => handleAddAction()}>
                                    <Add className="mr-2" /> Add Action
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}

            {activeTab === 1 && (
                <>
                    {/* Header */}
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold">Run workflow.</h2>
                        <p className="text-gray-600">Fill in the input to kick off your workflow.</p>
                    </div>

                    {/* Input Container */}
                    <div className="w-full mx-auto bg-white border border-gray-200 shadow-sm rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 flex items-center justify-center bg-yellow-100 rounded-full">
                                <Bolt className="text-yellow-600 w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-medium">Input</h3>
                        </div>

                        {triggerInputs.map((input) => (
                            <div key={input.id} className="mb-4">
                                <label className="block text-xs font-medium text-gray-600 uppercase mb-2">{input.name}</label>
                                <input
                                    type="text"
                                    className={`w-full px-3 py-2 border rounded-lg ${!runInputValues[input.id] ? "border-red-500" : "border-gray-300"
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    value={runInputValues[input.id] || ""}
                                    onChange={(e) =>
                                        setRunInputValues({
                                            ...runInputValues,
                                            [input.id]: e.target.value,
                                        })
                                    }
                                />
                                {!runInputValues[input.id] && (
                                    <p className="text-xs text-red-500 mt-1">This field is required</p>
                                )}
                            </div>
                        ))}

                        <button
                            className={`w-full flex items-center justify-center px-4 py-2 font-medium rounded-lg shadow-sm ${triggerInputs.some(input => !runInputValues[input.id]) ? "cursor-not-allowed bg-gray-400 text-gray-100" : "bg-purple-600 hover:bg-purple-700 text-purple-100"}`}
                            onClick={handleRunWorkflow}
                            disabled={triggerInputs.some(input => !runInputValues[input.id])}
                        >
                            ▶ Run Workflow
                        </button>

                        <button className="mt-4 flex items-center justify-center w-full px-4 py-2 text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition"
                            onClick={() => setActiveTab(2)}>
                            📊 Go to the Table to run in bulk and view all runs →
                        </button>
                    </div>

                    {/* Results Section */}
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold">Results</h3>
                        <p className="text-gray-600">Your output will appear below.</p>

                        <div className="w-full mx-auto mt-4 bg-white border border-gray-200 shadow-sm rounded-xl px-4 py-3">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full">
                                    <Sparkles className="text-blue-600 w-5 h-5" />
                                </div>
                                <p className="text-gray-600 font-medium"> Generate Text</p>
                            </div>

                            {workflowRun && workflowRun.results.map((result, index) => (
                                <div key={index} className="p-2 mt-2 bg-gray-50 rounded-lg border border-gray-200 ">
                                    <p className="text-base">{result}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {activeTab === 2 && (
                <div>
                    <p className="text-2xl font-semibold mb-4">
                        Bulk Operations
                    </p>
                    <div className="flex flex-col items-center mt-4">
                        <TableChart className="text-gray-500" style={{ fontSize: 80 }} />
                        <p className="text-gray-500 text-center">
                            Bulk operation functionality will be implemented here
                        </p>
                    </div>
                </div>
            )}

            <Drawer
                anchor="right"
                open={isDrawerOpen}
                onClose={() => {
                    setIsDrawerOpen(false);
                    setSelectedTriggerInput(null);
                    setSelectedActionIndex(null);
                }}
                sx={{
                    "& .MuiDrawer-paper": {
                        width: 400,
                    },
                }}
            >
                <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-lg font-semibold">
                            {drawerType === "trigger"
                                ? (selectedTriggerInput ? "Edit Input" : "Add Input")
                                : (selectedActionIndex !== null && actions[selectedActionIndex] ? "Edit Action" : "Add Action")}
                        </p>
                        <button onClick={() => {
                            setIsDrawerOpen(false);
                            setSelectedTriggerInput(null);
                            setSelectedActionIndex(null);
                        }} className="p-2">
                            <Close />
                        </button>
                    </div>

                    {drawerType === "trigger" ? (
                        <TriggerDrawer
                            onAddInput={handleAddInput}
                            editingInput={selectedTriggerInput ? {
                                name: selectedTriggerInput.name,
                                description: selectedTriggerInput.description
                            } : null}
                        />
                    ) : (
                        <ActionDrawer
                            triggerInputs={triggerInputs}
                            onAddAction={handleAddGenerateText}
                            editingAction={selectedActionIndex !== null && actions[selectedActionIndex] ? {
                                prompt: actions[selectedActionIndex].prompt,
                                backgroundData: actions[selectedActionIndex].backgroundData
                            } : null}
                        />
                    )}
                </div>
            </Drawer>

            <Dialog open={showSaveDialog} onClose={() => handleSaveDialogClose(false)}>
                <DialogTitle>Save Changes?</DialogTitle>
                <DialogContent>
                    <p className="text-gray-700">You have unsaved changes in your workflow. Would you like to save them before continuing?</p>
                </DialogContent>
                <div className="flex gap-2 justify-end p-3">
                    <button
                        onClick={() => handleSaveDialogClose(false)}
                        className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600"
                    >
                        Don't Save
                    </button>
                    <button
                        onClick={() => handleSaveDialogClose(true)}
                        className="bg-black text-white rounded px-4 py-2 hover:bg-gray-800"
                    >
                        Save Changes
                    </button>
                </div>
            </Dialog>
        </div>
    );
}