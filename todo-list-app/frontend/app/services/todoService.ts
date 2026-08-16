import { Todo, ApiResponse } from "../types/todo";
import { TODO_API } from "../apiConfig";

export async function getTodos(): Promise<ApiResponse<Todo[]>> {
  const res = await fetch(TODO_API.list);
  return await res.json();
}

export async function getTodo(id: string): Promise<ApiResponse<Todo>> {
  const res = await fetch(TODO_API.get(id));
  return await res.json();
}

export async function addTodo(todo: Partial<Todo>): Promise<ApiResponse<boolean>> {
  const res = await fetch(TODO_API.add, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo),
  });
  return res.json();
}

export async function updateTodo(id: string, todo: Partial<Todo>): Promise<ApiResponse<boolean>> {
  const res = await fetch(TODO_API.update(id), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo),
  });
  return res.json();
}

export async function deleteTodo(id: string): Promise<ApiResponse<boolean>> {
  const res = await fetch(TODO_API.delete(id));
  return await res.json();
}
