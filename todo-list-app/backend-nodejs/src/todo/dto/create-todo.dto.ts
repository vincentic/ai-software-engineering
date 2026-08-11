export class CreateTodoDto {
  todoId?: string;
  todoName: string;
  dueDate?: string | null;
  isFinished?: number;
}
