"use client";
import { useEffect, useState } from "react";
import AddTodo from "./AddTodo";
import { addTodo, getTodos, deleteTodo, updateTodo, getTodo } from "../services/todoService";
import { Todo } from "../types/todo";


export default function HomeClient() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const refreshTodos = async () => {
    try {
      const updatedTodos = await getTodos();
      if (updatedTodos.code === 200 && Array.isArray(updatedTodos.data)) {
        setTodos(updatedTodos.data);
        return true;
      }
    } catch (err) {
      console.error("Error refreshing todos:", err);
    }
    return false;
  };

  useEffect(() => {
    void refreshTodos();
  }, []);

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

  const handleAdd = async (task: string) => {
    // If editId exists, perform update
    if (editId) {
      try {
        setIsLoading(true);
        const res = await updateTodo(editId, { todoName: task });
        if (res.code === 200) {
          const ok = await refreshTodos();
          if (ok) {
            // clear edit state
            setEditId(null);
            setEditValue("");
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
      const result = await addTodo({ todoName: task, isFinished: 0 });
      
      if (result.code === 200) {
        // Fetch updated todos list
        await refreshTodos();
        setEditValue("");
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
        alert(`Task: ${t.todoName}\nDue: ${t.dueDate ? new Date(t.dueDate).toLocaleString() : '-'}\nStatus: ${t.isFinished ? 'Finished' : 'Pending'}`);
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
        onCancel={() => { setEditId(null); setEditValue(""); }}
        disabled={isLoading}
        isEditing={Boolean(editId)}
      />
      <div className="w-160 min-h-80 mx-auto mt-2 p-4 bg-zinc-50 shadow-sm dark:bg-zinc-50 dark:border-zinc-50">
        <h2 className="text-2xl font-semibold mb-6 text-zinc-800 dark:text-zinc-200 text-center">
          Your Tasks
        </h2>
        <ul className="mx-auto space-y-2">
          {todos.length === 0 ? (
            <li className="p-2 bg-white border border-zinc-300 rounded-md shadow-sm dark:bg-zinc-800 dark:border-zinc-600">
              No tasks found.
            </li>
          ) : (
            todos.map((todo: Todo) => (
              <li key={todo.todoId} className="w-full p-4 mx-auto flex-col bg-white border border-zinc-300 rounded-md shadow-sm dark:bg-zinc-800 dark:border-zinc-600">
                <div className="flex justify-between items-start">
                  <div className="flex w-full gap-4 items-center space-between">
                    <input
                      type="checkbox"
                      checked={todo.isFinished === 1}
                      onChange={() => handleToggleFinished(todo.todoId, todo.isFinished)}
                      disabled={togglingId === todo.todoId}
                      className="w-5 h-5 cursor-pointer accent-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <div className={`font-semibold w-30 ${todo.isFinished === 1 ? 'line-through text-zinc-400' : ''}`}>
                      {todo.todoName}
                    </div>
                    <div className="w-25 text-sm text-zinc-500">Due: {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : "-"}</div>
                    <div className="text-xs mt-1 ">{todo.isFinished ? "Finished" : "Pending"}</div>
                  </div>
                  <div className="flex items-center gap-2">
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
