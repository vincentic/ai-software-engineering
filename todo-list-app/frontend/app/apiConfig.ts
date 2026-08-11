// API configuration for backend service endpoints

export const TODO_API = {
  list: "/api/todo/list",
  get: (id: string) => `/api/todo/${id}`,
  add: "/api/todo/add",
  update: (id: string) => `/api/todo/update/${id}`,
  delete: (id: string) => `/api/todo/delete/${id}`,
};
