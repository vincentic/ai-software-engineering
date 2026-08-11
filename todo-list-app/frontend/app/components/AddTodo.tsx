"use client";
import React from "react";

interface AddTodoProps {
  onAdd: (task: string) => void;
  value?: string;
  onChange?: (val: string) => void;
  onCancel?: () => void;
  disabled?: boolean;
  isEditing?: boolean;
}

export default function AddTodo({ onAdd, value = "", onChange, onCancel, disabled = false, isEditing = false }: AddTodoProps) {
  function handleAdd() {
    const trimmed = value?.trim();
    if (trimmed && !disabled) {
      onAdd(trimmed);
    }
  }

  return (
    <div className="flex-col text-center px-4">
      <textarea
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="w-160 h-20 p-4 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-200"
        placeholder="Write your tasks here..."
      />
      <div>
        <button
          onClick={handleAdd}
          disabled={disabled}
          className="mt-2 px-4 py-2 bg-zinc-400 text-white rounded-md hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-50 mr-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {disabled ? (isEditing ? "Saving..." : "Adding...") : (isEditing ? "Save" : "Add Task")}
        </button>
        {isEditing && (
          <button
            onClick={onCancel}
            type="button"
            className="mt-2 px-4 py-2 bg-zinc-200 text-zinc-800 rounded-md hover:bg-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-50"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
