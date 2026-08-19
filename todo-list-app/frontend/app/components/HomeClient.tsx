"use client";
import { useCallback, useEffect, useState } from "react";
import AddTodo from "./AddTodo";
import { addTodo, getTodos, deleteTodo, updateTodo, getTodo } from "../services/todoService";
import { Todo } from "../types/todo";
import { getCalendarInfo } from "../lib/calendarInfo";


export default function HomeClient() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [dueDateValue, setDueDateValue] = useState<string>("");
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const calendarInfo = getCalendarInfo();

  const refreshTodos = useCallback(async () => {
    try {
      const updatedTodos = await getTodos();
      if (updatedTodos.code === 200 && Array.isArray(updatedTodos.data)) {
        setTodos(updatedTodos.data);
        setError(null);
        return true;
      }
    } catch (err) {
      console.error("Error refreshing todos:", err);
    }
    setError("Unable to load tasks. Please try again.");
    return false;
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadTodos = async () => {
      await refreshTodos();
      if (isMounted) {
        setIsInitialLoading(false);
      }
    };

    void loadTodos();

    return () => {
      isMounted = false;
    };
  }, [refreshTodos]);

  const handleToggleFinished = async (todoId: string, currentStatus: number) => {
    try {
      setTogglingId(todoId);
      const res = await updateTodo(todoId, { isFinished: currentStatus === 0 ? 1 : 0 });
      if (res.code === 200) {
        await refreshTodos();
      } else {
        alert("Failed to update task status. Please try again.");
      }
    } catch (error) {
      console.error("Error toggling task status:", error);
      alert("Error updating task status. Please try again.");
    } finally {
      setTogglingId(null);
    }
  };

  const selectedDueDate = () => {
    if (!dueDateValue) {
      return {};
    }

    return { dueDate: new Date(`${dueDateValue}T12:00:00`).toISOString() };
  };

  const resetForm = () => {
    setEditId(null);
    setEditValue("");
    setDueDateValue("");
  };

  const handleAdd = async (task: string) => {
    // If editId exists, perform update
    if (editId) {
      try {
        setIsLoading(true);
        const res = await updateTodo(editId, { todoName: task, ...selectedDueDate() });
        if (res.code === 200) {
          const ok = await refreshTodos();
          if (ok) {
            resetForm();
          }
        } else {
          alert("Failed to save changes. Please try again.");
        }
      } catch (error) {
        console.error("Error updating task:", error);
        alert("Error updating task. Please try again.");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Add new todo
    try {
      setIsLoading(true);
      const result = await addTodo({ todoName: task, isFinished: 0, ...selectedDueDate() });
      
      if (result.code === 200) {
        // Fetch updated todos list
        await refreshTodos();
        resetForm();
      }
    } catch (error) {
      console.error("Error adding task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (todoId: string, todoName: string) => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete this task?\n\n"${todoName}"`
    );
    
    if (!confirmed) return;

    try {
      setDeletingId(todoId);
      const result = await deleteTodo(todoId);
      
      if (result.code === 200) {
        // Fetch updated todos list
        await refreshTodos();
      } else {
        alert("Failed to delete task. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Error deleting task. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleView = async (todoId: string) => {
    try {
      setViewingId(todoId);
      const res = await getTodo(todoId);
      if (res && res.code === 200 && res.data) {
        const t = res.data;
        alert(`Task: ${t.todoName}\nDue: ${t.dueDate ? new Date(t.dueDate).toLocaleString() : '-'}\nStatus: ${t.isFinished ? 'Finished' : 'Pending'}\nCompleted: ${t.completedAt ? new Date(t.completedAt).toLocaleString() : '-'}`);
      } else {
        alert('Task not found.');
      }
    } catch (err) {
      console.error('Error fetching todo:', err);
      alert('Failed to fetch task details.');
    } finally {
      setViewingId(null);
    }
  };

  return (
    <>
      <h1 className="flex flex-col justify-center p-10 text-center text-4xl font-bold text-zinc-800 dark:text-zinc-200">
        Todo-list<br />
        <i>
          <small>Welcome to the real world ! <br />
            Life sucks. You are gonna love it.</small>
        </i>
      </h1>
      <AddTodo
        onAdd={handleAdd}
        value={editValue}
        onChange={setEditValue}
        dueDateValue={dueDateValue}
        onDueDateChange={setDueDateValue}
        onCancel={resetForm}
        disabled={isLoading}
        isEditing={Boolean(editId)}
      />
      <div className="mx-auto mt-2 min-h-80 w-full max-w-3xl bg-zinc-50 p-4 shadow-sm dark:bg-zinc-50 dark:border-zinc-50">
        <h2 className="text-2xl font-semibold mb-6 text-zinc-800 dark:text-zinc-200 text-center">
          Your Tasks
        </h2>
        <div className="mb-4 grid grid-cols-2 gap-2 border border-zinc-200 bg-white p-3 text-sm text-zinc-700 sm:grid-cols-4">
          <div>
            <div className="text-xs text-zinc-400">Year</div>
            <div className="font-semibold">{calendarInfo.year}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-400">Month</div>
            <div className="font-semibold">{calendarInfo.month}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-400">Week</div>
            <div className="font-semibold">W{calendarInfo.week}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-400">Solar Term</div>
            <div className="font-semibold">{calendarInfo.solarTermRange}</div>
          </div>
        </div>
        {error && (
          <div className="mb-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <ul className="mx-auto space-y-2">
          {isInitialLoading ? (
            <li className="p-2 bg-white border border-zinc-300 shadow-sm dark:bg-zinc-800 dark:border-zinc-600">
              Loading tasks...
            </li>
          ) : todos.length === 0 ? (
            <li className="p-2 bg-white border border-zinc-300 rounded-md shadow-sm dark:bg-zinc-800 dark:border-zinc-600">
              No tasks found.
            </li>
          ) : (
            todos.map((todo: Todo) => (
              <li key={todo.todoId} className="mx-auto w-full bg-white p-4 shadow-sm dark:bg-zinc-800 dark:border-zinc-600">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 flex-1 gap-4 items-center">
                    <input
                      type="checkbox"
                      checked={todo.isFinished === 1}
                      onChange={() => handleToggleFinished(todo.todoId, todo.isFinished)}
                      disabled={togglingId === todo.todoId}
                      className="w-5 h-5 cursor-pointer accent-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <div className="min-w-0 flex-1">
                      <div className={`break-words font-semibold ${todo.isFinished === 1 ? 'line-through text-zinc-400' : ''}`}>
                        {todo.todoName}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-500">
                        <span>Due: {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : "-"}</span>
                        <span>Completed: {todo.completedAt ? new Date(todo.completedAt).toLocaleDateString() : "-"}</span>
                      </div>
                    </div>
                    <div className="hidden text-xs sm:block">
                      {todo.isFinished ? "Finished" : "Pending"}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <button
                      onClick={() => handleView(todo.todoId)}
                      disabled={viewingId === todo.todoId}
                      className="px-3 py-1 bg-zinc-200 text-zinc-800 text-sm rounded-md hover:bg-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-400 transition-colors"
                    >
                      {viewingId === todo.todoId ? "Loading..." : "View"}
                    </button>
                    <button
                      onClick={() => {
                        setEditId(todo.todoId);
                        setEditValue(todo.todoName || "");
                        setDueDateValue(todo.dueDate ? new Date(todo.dueDate).toISOString().slice(0, 10) : "");
                        // scroll to top or focus could be added
                      }}
                      className="px-3 py-1 bg-zinc-400 text-white text-sm rounded-md hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(todo.todoId, todo.todoName)}
                      disabled={deletingId === todo.todoId}
                      className="px-3 py-1 bg-zinc-400 text-white text-sm rounded-md hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {deletingId === todo.todoId ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  );
}
