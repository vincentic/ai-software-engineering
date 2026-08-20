"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getTodo } from "../services/todoService";
import { Todo } from "../types/todo";
import { Language, translations } from "../lib/i18n";

export default function TodoDetailClient({ todoId }: { todoId: string }) {
  const [language, setLanguage] = useState<Language>("zh");
  const [todo, setTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const t = translations[language];

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("todo-language");
    if (savedLanguage === "zh" || savedLanguage === "en") {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadTodo = async () => {
      try {
        const response = await getTodo(todoId);
        if (isMounted && response.code === 200 && response.data) {
          setTodo(response.data);
          setError("");
        } else if (isMounted) {
          setError(t.taskNotFound);
        }
      } catch (err) {
        console.error("Error loading task:", err);
        if (isMounted) {
          setError(t.fetchTaskFailed);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadTodo();

    return () => {
      isMounted = false;
    };
  }, [todoId, t.fetchTaskFailed, t.taskNotFound]);

  return (
    <main className="ink-page px-4 py-8">
      <div className="ink-paper mx-auto w-full max-w-2xl p-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold text-stone-900">{t.taskDetails}</h1>
          <Link href="/" className="ink-button-secondary px-3 py-2 text-sm font-semibold">
            {t.backToList}
          </Link>
        </div>

        {isLoading ? (
          <p className="ink-muted">{t.loadingTask}</p>
        ) : error ? (
          <p className="text-sm text-red-700">{error}</p>
        ) : todo ? (
          <div className="space-y-3 text-sm text-stone-800">
            <div>
              <div className="ink-muted text-xs">{t.task}</div>
              <div className="break-words text-lg font-semibold">{todo.todoName}</div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Detail label={t.created} value={todo.createdAt ? new Date(todo.createdAt).toLocaleString() : "-"} />
              <Detail label={t.due} value={todo.dueDate ? new Date(todo.dueDate).toLocaleString() : "-"} />
              <Detail label={t.completed} value={todo.completedAt ? new Date(todo.completedAt).toLocaleString() : "-"} />
              <Detail label={t.status} value={todo.isFinished ? t.finished : t.pending} />
            </div>
            <Link href={`/todo/${todo.todoId}/edit`} className="ink-button inline-flex px-4 py-2 text-sm font-semibold">
              {t.edit}
            </Link>
          </div>
        ) : null}
      </div>
    </main>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="ink-calendar p-3">
      <div className="ink-muted text-xs">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
