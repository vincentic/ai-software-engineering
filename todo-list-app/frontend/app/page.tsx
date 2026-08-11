import HomeClient from "./components/HomeClient";
import { getTodos } from "./services/todoService";
import { Todo } from "./types/todo";

export default async function Home() {
  // Fetch todos on the server and pass as initial state to the client component
  let initialTodos: Todo[] = [];
  try {
    const res = await getTodos();
    if (res && res.code === 200 && Array.isArray(res.data)) {
      initialTodos = res.data;
    }
  } catch (err) {
    console.error("Error fetching todos:", err);
  }

  return (
    <div className="flex-col min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <HomeClient initialTodos={initialTodos} />
    </div>
  );
}
