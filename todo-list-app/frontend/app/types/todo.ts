export interface Todo {
  todoId: string;
  todoName: string;
  dueDate: string | null;
  isFinished: number;
  completedAt: string | null;
  isDeleted: number;
}

export interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

export interface TodoPage {
  items: Todo[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
