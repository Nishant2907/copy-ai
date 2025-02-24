"use client";

import { useState, useEffect } from "react";
import {
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
} from "@mui/material";
import { Input as InputIcon } from "@mui/icons-material";

interface TriggerDrawerProps {
  onAddInput: (input: { name: string; description: string }) => void;
  editingInput?: { name: string; description: string } | null;
}

export default function TriggerDrawer({ onAddInput, editingInput }: TriggerDrawerProps) {
  const [showInputForm, setShowInputForm] = useState(false);
  const [newInput, setNewInput] = useState({ name: "", description: "" });

  // Set initial values if editing
  useEffect(() => {
    if (editingInput) {
      setNewInput(editingInput);
      setShowInputForm(true);
    }
  }, [editingInput]);

  // Function to handle adding a new input
  const handleAddInput = () => {
    if (newInput.name) {
      onAddInput(newInput);
      setNewInput({ name: "", description: "" });
      setShowInputForm(false);
    }
  };

  return (
    <div className="p-4">
      {!showInputForm ? (
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => setShowInputForm(true)}>
              <ListItemIcon>
                <InputIcon />
              </ListItemIcon>
              <ListItemText
                primary="Manual Input"
                secondary="Add an input field to your workflow"
              />
            </ListItemButton>
          </ListItem>
        </List>
      ) : (
        <div className="p-4 border rounded-lg shadow-md bg-white">
          <p className="text-lg font-semibold mb-4">Add Input</p>

          <TextField
            fullWidth
            label="Input Name"
            value={newInput.name}
            onChange={(e) => setNewInput({ ...newInput, name: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Input Description"
            multiline
            value={newInput.description}
            onChange={(e) => setNewInput({ ...newInput, description: e.target.value })}
            margin="normal"
          />
          <Button variant="contained" onClick={handleAddInput}
            sx={{
              mt: 2,
              bgcolor: 'black',
              color: 'white',
              borderRadius: 1,
              width: '100%',
            }}
          >
            {editingInput ? "Update Input" : "Add Input"}
          </Button>
        </div>
      )}
    </div>
  );
}