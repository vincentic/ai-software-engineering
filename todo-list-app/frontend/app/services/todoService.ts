import { Todo, ApiResponse } from "../types/todo";
import { TODO_API } from "../apiConfig";

async function request<T>(url: string, init?: RequestInit): Promise<ApiResponse<T>> {
  const res = await fetch(url, init);
  const data = (await res.json()) as ApiResponse<T>;

  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  return data;
}

export async function getTodos(): Promise<ApiResponse<Todo[]>> {
  return request<Todo[]>(TODO_API.list);
}

export async function getTodo(id: string): Promise<ApiResponse<Todo>> {
  return request<Todo>(TODO_API.get(id));
}

export async function addTodo(todo: Partial<Todo>): Promise<ApiResponse<boolean>> {
  return request<boolean>(TODO_API.add, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo),
  });
}

export async function updateTodo(id: string, todo: Partial<Todo>): Promise<ApiResponse<boolean>> {
  return request<boolean>(TODO_API.update(id), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo),
  });
}

export async function deleteTodo(id: string): Promise<ApiResponse<boolean>> {
  return request<boolean>(TODO_API.delete(id));
}
