import { Todo } from "../types/todo";
import { getTodos } from "../services/todoService";

export default async function TodoListServer() {
  let todos: Todo[] = [];
  try {
    const res = await getTodos();
    if (res && res.code === 200 && Array.isArray(res.data)) {
      todos = res.data;
    } else {
      todos = [];
    }
  } catch (err) {
    todos = [];
  }

  return (
    <div className="w-120 min-h-80 mx-auto mt-2 p-6 bg-zinc-50 shadow-sm dark:bg-zinc-50 dark:border-zinc-50">
      <h2 className="text-2xl font-semibold mb-6 text-zinc-800 dark:text-zinc-200 text-center ">
        Your Tasks
      </h2>
      <ul className="mx-auto space-y-2">
        {todos.length === 0 ? (
          <li className="p-4 bg-white border border-zinc-300 rounded-md shadow-sm dark:bg-zinc-800 dark:border-zinc-600">
            No tasks found.
          </li>
        ) : (
          todos.map((todo: any) => (
            <li key={todo.todoId} className="w-80 p-4 mx-auto flex-col bg-white border border-zinc-300 rounded-md shadow-sm dark:bg-zinc-800 dark:border-zinc-600">
              <div className="font-semibold">{todo.todoName}</div>
              {/* <div className="text-sm text-zinc-500">Due: {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : "-"}</div>
              <div className="text-xs mt-1">{todo.isFinished ? "Finished" : "Pending"}</div> */}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
