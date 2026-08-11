import { Todo, ApiResponse } from "../types/todo";

export async function getTodos(): Promise<ApiResponse<Todo[]>> {
  const res = await fetch("http://localhost:3001/api/todo/list");
  return await res.json();
}

export async function getTodo(id: string): Promise<ApiResponse<Todo>> {
  const res = await fetch(`http://localhost:3001/api/todo/${id}`);
  return await res.json();
}

export async function addTodo(todo: Partial<Todo>): Promise<ApiResponse<boolean>> {
  const res = await fetch("http://localhost:3001/api/todo/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo),
  });
  return res.json();
}

export async function updateTodo(id: string, todo: Partial<Todo>): Promise<ApiResponse<boolean>> {
  const res = await fetch(`http://localhost:3001/api/todo/update/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo),
  });
  return res.json();
}

export async function deleteTodo(id: string): Promise<ApiResponse<boolean>> {
  const res = await fetch(`http://localhost:3001/api/todo/delete/${id}`);
  return await res.json();
}
