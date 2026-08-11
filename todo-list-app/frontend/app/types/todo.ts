export interface Todo {
  todoId: string;
  todoName: string;
  dueDate: string;
  isFinished: number;
  isDeleted: number;
}

export interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}
