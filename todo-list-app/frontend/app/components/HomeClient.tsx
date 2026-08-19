"use client";
import { useCallback, useEffect, useState } from "react";
import AddTodo from "./AddTodo";
import { addTodo, getTodos, deleteTodo, updateTodo, getTodo } from "../services/todoService";
import { Todo } from "../types/todo";
import { getCalendarInfo } from "../lib/calendarInfo";

type Language = "zh" | "en";

const translations = {
  zh: {
    welcome: "欢迎来到真实世界！",
    motto: "生活不容易，但你会喜欢它。",
    switchLanguage: "EN",
    switchLanguageLabel: "Switch to English",
    yourTasks: "你的任务",
    year: "年份",
    month: "月份",
    week: "周数",
    weekPrefix: "第",
    weekSuffix: "周",
    solarTerm: "节气范围",
    loadError: "无法加载任务，请重试。",
    updateStatusFailed: "更新任务状态失败，请重试。",
    updateStatusError: "更新任务状态出错，请重试。",
    saveFailed: "保存修改失败，请重试。",
    saveError: "更新任务出错，请重试。",
    deleteConfirm: (todoName: string) => `确定要删除这个任务吗？\n\n"${todoName}"`,
    deleteFailed: "删除任务失败，请重试。",
    deleteError: "删除任务出错，请重试。",
    task: "任务",
    due: "截止",
    status: "状态",
    completed: "完成日期",
    finished: "已完成",
    pending: "待完成",
    taskNotFound: "没有找到任务。",
    fetchTaskFailed: "获取任务详情失败。",
    loadingTasks: "正在加载任务...",
    noTasks: "暂无任务。",
    loading: "加载中...",
    view: "查看",
    edit: "编辑",
    deleting: "删除中...",
    delete: "删除",
    form: {
      taskPlaceholder: "在这里写下你的任务...",
      dueDate: "截止日期",
      addTask: "添加任务",
      adding: "添加中...",
      save: "保存",
      saving: "保存中...",
      cancel: "取消",
    },
  },
  en: {
    welcome: "Welcome to the real world!",
    motto: "Life sucks. You are gonna love it.",
    switchLanguage: "中文",
    switchLanguageLabel: "切换到中文",
    yourTasks: "Your Tasks",
    year: "Year",
    month: "Month",
    week: "Week",
    weekPrefix: "W",
    weekSuffix: "",
    solarTerm: "Solar Term",
    loadError: "Unable to load tasks. Please try again.",
    updateStatusFailed: "Failed to update task status. Please try again.",
    updateStatusError: "Error updating task status. Please try again.",
    saveFailed: "Failed to save changes. Please try again.",
    saveError: "Error updating task. Please try again.",
    deleteConfirm: (todoName: string) => `Are you sure you want to delete this task?\n\n"${todoName}"`,
    deleteFailed: "Failed to delete task. Please try again.",
    deleteError: "Error deleting task. Please try again.",
    task: "Task",
    due: "Due",
    status: "Status",
    completed: "Completed",
    finished: "Finished",
    pending: "Pending",
    taskNotFound: "Task not found.",
    fetchTaskFailed: "Failed to fetch task details.",
    loadingTasks: "Loading tasks...",
    noTasks: "No tasks found.",
    loading: "Loading...",
    view: "View",
    edit: "Edit",
    deleting: "Deleting...",
    delete: "Delete",
    form: {
      taskPlaceholder: "Write your tasks here...",
      dueDate: "Due date",
      addTask: "Add Task",
      adding: "Adding...",
      save: "Save",
      saving: "Saving...",
      cancel: "Cancel",
    },
  },
} as const;

export default function HomeClient() {
  const [language, setLanguage] = useState<Language>("zh");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [dueDateValue, setDueDateValue] = useState<string>("");
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [hasLoadError, setHasLoadError] = useState(false);
  const calendarInfo = getCalendarInfo();
  const t = translations[language];

  const refreshTodos = useCallback(async () => {
    try {
      const updatedTodos = await getTodos();
      if (updatedTodos.code === 200 && Array.isArray(updatedTodos.data)) {
        setTodos(updatedTodos.data);
        setHasLoadError(false);
        return true;
      }
    } catch (err) {
      console.error("Error refreshing todos:", err);
    }
    setHasLoadError(true);
    return false;
  }, []);

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("todo-language");
    if (savedLanguage === "zh" || savedLanguage === "en") {
      setLanguage(savedLanguage);
    }
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

  const toggleLanguage = () => {
    setLanguage((current) => {
      const next = current === "zh" ? "en" : "zh";
      window.localStorage.setItem("todo-language", next);
      return next;
    });
  };

  const handleToggleFinished = async (todoId: string, currentStatus: number) => {
    try {
      setTogglingId(todoId);
      const res = await updateTodo(todoId, { isFinished: currentStatus === 0 ? 1 : 0 });
      if (res.code === 200) {
        await refreshTodos();
      } else {
        alert(t.updateStatusFailed);
      }
    } catch (error) {
      console.error("Error toggling task status:", error);
      alert(t.updateStatusError);
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
          alert(t.saveFailed);
        }
      } catch (error) {
        console.error("Error updating task:", error);
        alert(t.saveError);
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
    const confirmed = window.confirm(t.deleteConfirm(todoName));
    
    if (!confirmed) return;

    try {
      setDeletingId(todoId);
      const result = await deleteTodo(todoId);
      
      if (result.code === 200) {
        // Fetch updated todos list
        await refreshTodos();
      } else {
        alert(t.deleteFailed);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      alert(t.deleteError);
    } finally {
      setDeletingId(null);
    }
  };

  const handleView = async (todoId: string) => {
    try {
      setViewingId(todoId);
      const res = await getTodo(todoId);
      if (res && res.code === 200 && res.data) {
        const todo = res.data;
        alert(`${t.task}: ${todo.todoName}\n${t.due}: ${todo.dueDate ? new Date(todo.dueDate).toLocaleString() : '-'}\n${t.status}: ${todo.isFinished ? t.finished : t.pending}\n${t.completed}: ${todo.completedAt ? new Date(todo.completedAt).toLocaleString() : '-'}`);
      } else {
        alert(t.taskNotFound);
      }
    } catch (err) {
      console.error('Error fetching todo:', err);
      alert(t.fetchTaskFailed);
    } finally {
      setViewingId(null);
    }
  };

  return (
    <main className="ink-page">
      <div className="mx-auto flex w-full max-w-3xl justify-end px-4 pt-4">
        <button
          type="button"
          onClick={toggleLanguage}
          aria-label={t.switchLanguageLabel}
          className="ink-button-secondary px-3 py-1 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-stone-500"
        >
          {t.switchLanguage}
        </button>
      </div>
      <h1 className="ink-title flex flex-col justify-center p-10 text-center text-4xl font-bold">
        Todo-list<br />
        <i className="ink-muted text-lg font-normal">
          <small>{t.welcome}<br />
            {t.motto}</small>
        </i>
      </h1>
      <AddTodo
        onAdd={handleAdd}
        value={editValue}
        onChange={setEditValue}
        dueDateValue={dueDateValue}
        onDueDateChange={setDueDateValue}
        labels={t.form}
        onCancel={resetForm}
        disabled={isLoading}
        isEditing={Boolean(editId)}
      />
      <div className="ink-paper ink-panel mx-auto mt-4 min-h-80 w-full max-w-3xl p-4">
        <h2 className="relative mb-6 text-center text-2xl font-semibold text-stone-900">
          {t.yourTasks}
        </h2>
        <div className="ink-calendar relative mb-4 grid grid-cols-2 gap-2 p-3 text-sm text-stone-800 sm:grid-cols-4">
          <div>
            <div className="ink-muted text-xs">{t.year}</div>
            <div className="font-semibold">{calendarInfo.year}</div>
          </div>
          <div>
            <div className="ink-muted text-xs">{t.month}</div>
            <div className="font-semibold">{calendarInfo.month}</div>
          </div>
          <div>
            <div className="ink-muted text-xs">{t.week}</div>
            <div className="font-semibold">{t.weekPrefix}{calendarInfo.week}{t.weekSuffix}</div>
          </div>
          <div>
            <div className="ink-muted text-xs">{t.solarTerm}</div>
            <div className="font-semibold">{calendarInfo.solarTermRange}</div>
          </div>
        </div>
        {hasLoadError && (
          <div className="relative mb-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {t.loadError}
          </div>
        )}
        <ul className="relative mx-auto space-y-2">
          {isInitialLoading ? (
            <li className="ink-card p-3 shadow-sm">
              {t.loadingTasks}
            </li>
          ) : todos.length === 0 ? (
            <li className="ink-card p-3 shadow-sm">
              {t.noTasks}
            </li>
          ) : (
            todos.map((todo: Todo) => (
              <li key={todo.todoId} className="ink-card mx-auto w-full p-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 flex-1 gap-4 items-center">
                    <input
                      type="checkbox"
                      checked={todo.isFinished === 1}
                      onChange={() => handleToggleFinished(todo.todoId, todo.isFinished)}
                      disabled={togglingId === todo.todoId}
                      className="h-5 w-5 cursor-pointer accent-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <div className="min-w-0 flex-1">
                      <div className={`break-words font-semibold ${todo.isFinished === 1 ? 'line-through text-stone-400' : 'text-stone-900'}`}>
                        {todo.todoName}
                      </div>
                      <div className="ink-muted mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                        <span>{t.due}: {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : "-"}</span>
                        <span>{t.completed}: {todo.completedAt ? new Date(todo.completedAt).toLocaleDateString() : "-"}</span>
                      </div>
                    </div>
                    <div className="ink-muted hidden text-xs sm:block">
                      {todo.isFinished ? t.finished : t.pending}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <button
                      onClick={() => handleView(todo.todoId)}
                      disabled={viewingId === todo.todoId}
                      className="ink-button-secondary px-3 py-1 text-sm transition-colors disabled:opacity-50"
                    >
                      {viewingId === todo.todoId ? t.loading : t.view}
                    </button>
                    <button
                      onClick={() => {
                        setEditId(todo.todoId);
                        setEditValue(todo.todoName || "");
                        setDueDateValue(todo.dueDate ? new Date(todo.dueDate).toISOString().slice(0, 10) : "");
                        // scroll to top or focus could be added
                      }}
                      className="ink-button px-3 py-1 text-sm transition-colors"
                    >
                      {t.edit}
                    </button>
                    <button
                      onClick={() => handleDelete(todo.todoId, todo.todoName)}
                      disabled={deletingId === todo.todoId}
                      className="ink-button ink-button-danger px-3 py-1 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === todo.todoId ? t.deleting : t.delete}
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </main>
  );
}
