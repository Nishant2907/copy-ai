"use client";

import { useEffect, useState } from "react";
import {
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  TextField,
} from "@mui/material";
import { Bolt } from "@mui/icons-material";

import { TextFields, Image, Code, Mic, Translate, Settings } from "@mui/icons-material"; // Importing icons

interface ActionDrawerProps {
  triggerInputs: Array<{ id: string; name: string }>;
  onAddAction: (action: { prompt: string; backgroundData: string }) => void;
  editingAction?: { prompt: string; backgroundData: string } | null;
}

export default function ActionDrawer({ triggerInputs, onAddAction, editingAction }: ActionDrawerProps) {
  const [showActionForm, setShowActionForm] = useState(false);
  const [newAction, setNewAction] = useState({ prompt: "", backgroundData: "" });
  const [variableAnchorEl, setVariableAnchorEl] = useState<null | HTMLElement>(null);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);

  // Set initial values if editing
  useEffect(() => {
    if (editingAction) {
      setNewAction(editingAction);
      setShowActionForm(true);
    }
  }, [editingAction]);

  // Closes the variable menu and clears the selected text area
  const handleVariableMenuClose = () => {
    setVariableAnchorEl(null); // Clear the anchor element
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    // Gives cursor position (0-based index) in the textarea
    const position = e.target.selectionStart;

    // Show variable menu if # is typed
    if (value[position - 1] === '#') {
      // Opens the variable menu when user type (#) in the prompt text area
      setVariableAnchorEl(e.target);
      // Set the cursor position
      setCursorPosition(position);
    }

    setNewAction({ ...newAction, prompt: value });
  };


  // Adds a variable to the end of the prompt
  const handleVariableSelect = (variable: string) => {
    if (cursorPosition === null) return;

    // Get the text before and after the cursor
    const beforeCursor = newAction.prompt.slice(0, cursorPosition);
    const afterCursor = newAction.prompt.slice(cursorPosition);

    // Insert the variable template at cursor position, keeping the #
    const template = `{${variable}}`;
    const newPrompt = beforeCursor + template + afterCursor;

    // Update the prompt with the new variable
    setNewAction({ ...newAction, prompt: newPrompt });

    // Close the variable menu
    handleVariableMenuClose();
    setCursorPosition(null);
  };

  // Adds a new action if the prompt is not empty
  const handleAddAction = () => {
    if (newAction.prompt) { // Check if the prompt is not empty
      onAddAction(newAction); // Call the function to add the action
      setNewAction({ prompt: "", backgroundData: "" }); // Reset the action form
      setShowActionForm(false); // Hide the action form
    }
  };

  return (
    <div className="p-4">
      {!showActionForm ? (
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => setShowActionForm(true)}>
              <ListItemIcon>
                <TextFields />
              </ListItemIcon>
              <ListItemText primary="Generate Text" secondary="Generate text using AI models" />
            </ListItemButton>
          </ListItem>
        </List>
      ) : (
        <div className="p-4 border rounded-lg shadow-md bg-white">
          <p className="text-lg font-semibold mb-4">Generate Text</p>

          <label className="text-sm font-semibold">Prompt</label>
          <p className="text-xs text-gray-800">Enter the main instruction or question you want to send to the AI model. Be clear and specific.</p>
          <TextField
            fullWidth
            label="Prompt"
            value={newAction.prompt}
            // onChange={(e) => setNewAction({ ...newAction, prompt: e.target.value })}
            margin="normal"
            onChange={handlePromptChange}
            multiline
          // onKeyDown={(e) => {
          //   if (e.key === "#") {
          //     handleVariableMenuOpen(e as any);
          //   }
          // }}
          />

          <p className="text-sm text-gray-500 mt-1 mb-2">Type # to insert input variables</p>

          <label className="text-sm font-semibold">Background Information</label>
          <p className="text-xs text-gray-800">Provide any additional context, examples, or guidelines you want the AI to consider when responding to the prompt. This can help improve the quality and accuracy of the output.</p>
          <TextField
            fullWidth
            label="Background Description"
            value={newAction.backgroundData}
            onChange={(e) => setNewAction({ ...newAction, backgroundData: e.target.value })}
            margin="normal"
            multiline
            minRows={1} // Starts with one row
            maxRows={Infinity} // Allows unlimited growth
            variant="outlined"
          />

          <Button
            variant="contained"
            onClick={handleAddAction}
            sx={{
              mt: 2,
              bgcolor: 'black',
              color: 'white',
              borderRadius: 1,
              width: '100%',
            }}
          >
            {editingAction ? "Save Action" : "Add Action"}
          </Button>
        </div>
      )}

      {/* Variable Menu */}
      <Menu
        anchorEl={variableAnchorEl}
        open={Boolean(variableAnchorEl)}
        onClose={handleVariableMenuClose}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "12px",
            minWidth: "220px",
            padding: "8px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        {/* Header */}
        <div className="px-4 py-2 text-sm font-semibold text-gray-600 border-b bg-gray-50">
          WORKFLOW INPUTS
        </div>

        {/* Menu Items */}
        <div className="p-2">
          {triggerInputs.map((input) => (
            <div
              key={input.id}
              onClick={() => handleVariableSelect(input.name)}
              className="flex items-center gap-3 px-3 py-2 my-1 overflow-scroll rounded-lg cursor-pointer bg-green-50 hover:bg-green-100 transition max-w-60"
            >
              {/* Icon Container */}
              <div className="w-8 h-8 flex items-center justify-center bg-yellow-100 rounded-full">
                <Bolt className="text-yellow-600 w-4 h-4" />
              </div>
              {/* Input Name */}
              <span className="font-semibold text-gray-800">{input.name}</span>
            </div>
          ))}
        </div>
      </Menu>
    </div>
  );
}
