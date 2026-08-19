"use client";
import React from "react";

interface AddTodoProps {
  onAdd: (task: string) => void;
  value?: string;
  onChange?: (val: string) => void;
  dueDateValue?: string;
  onDueDateChange?: (val: string) => void;
  labels: {
    taskPlaceholder: string;
    dueDate: string;
    addTask: string;
    adding: string;
    save: string;
    saving: string;
    cancel: string;
  };
  onCancel?: () => void;
  disabled?: boolean;
  isEditing?: boolean;
}

export default function AddTodo({
  onAdd,
  value = "",
  onChange,
  dueDateValue = "",
  onDueDateChange,
  labels,
  onCancel,
  disabled = false,
  isEditing = false,
}: AddTodoProps) {
  function handleAdd() {
    const trimmed = value?.trim();
    if (trimmed && !disabled) {
      onAdd(trimmed);
    }
  }

  return (
    <div className="ink-paper mx-auto flex w-full max-w-2xl flex-col px-4 py-4 text-center">
      <textarea
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="ink-field h-20 w-full resize-none p-4 shadow-sm"
        placeholder={labels.taskPlaceholder}
      />
      <label className="ink-muted mt-3 flex flex-col text-left text-sm font-medium">
        {labels.dueDate}
        <input
          type="date"
          value={dueDateValue}
          onChange={(e) => onDueDateChange && onDueDateChange(e.target.value)}
          disabled={disabled}
          className="ink-field mt-1 px-3 py-2 shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
        />
      </label>
      <div>
        <button
          onClick={handleAdd}
          disabled={disabled}
          className="ink-button mt-3 mr-4 px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {disabled ? (isEditing ? labels.saving : labels.adding) : (isEditing ? labels.save : labels.addTask)}
        </button>
        {isEditing && (
          <button
            onClick={onCancel}
            type="button"
            className="ink-button-secondary mt-3 px-4 py-2 text-sm font-semibold transition-colors"
          >
            {labels.cancel}
          </button>
        )}
      </div>
    </div>
  );
}
