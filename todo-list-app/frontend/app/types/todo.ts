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
