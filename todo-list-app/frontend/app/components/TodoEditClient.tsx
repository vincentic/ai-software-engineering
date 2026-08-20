"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AddTodo from "./AddTodo";
import { getTodo, updateTodo } from "../services/todoService";
import { Language, translations } from "../lib/i18n";

export default function TodoEditClient({ todoId }: { todoId: string }) {
  const router = useRouter();
  const [language, setLanguage] = useState<Language>("zh");
  const [task, setTask] = useState("");
  const [dueDateValue, setDueDateValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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
          setTask(response.data.todoName || "");
          setDueDateValue(response.data.dueDate ? new Date(response.data.dueDate).toISOString().slice(0, 10) : "");
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

  const selectedDueDate = () => {
    if (!dueDateValue) {
      return {};
    }

    return { dueDate: new Date(`${dueDateValue}T12:00:00`).toISOString() };
  };

  const handleSave = async (nextTask: string) => {
    try {
      setIsSaving(true);
      const response = await updateTodo(todoId, { todoName: nextTask, ...selectedDueDate() });
      if (response.code === 200) {
        router.push(`/todo/${todoId}`);
      } else {
        alert(t.saveFailed);
      }
    } catch (err) {
      console.error("Error saving task:", err);
      alert(t.saveError);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="ink-page px-4 py-8">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold text-stone-900">{t.editTask}</h1>
          <Link href={`/todo/${todoId}`} className="ink-button-secondary px-3 py-2 text-sm font-semibold">
            {t.backToList}
          </Link>
        </div>

        {isLoading ? (
          <div className="ink-paper p-5 text-sm">{t.loadingTask}</div>
        ) : error ? (
          <div className="ink-paper p-5 text-sm text-red-700">{error}</div>
        ) : (
          <AddTodo
            onAdd={handleSave}
            value={task}
            onChange={setTask}
            dueDateValue={dueDateValue}
            onDueDateChange={setDueDateValue}
            labels={t.form}
            onCancel={() => router.push(`/todo/${todoId}`)}
            disabled={isSaving}
            isEditing
          />
        )}
      </div>
    </main>
  );
}
