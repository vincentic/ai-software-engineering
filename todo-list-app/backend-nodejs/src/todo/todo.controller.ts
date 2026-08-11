import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TodoService } from './todo.service';
import { ApiResponse } from '../common/api-response';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('/todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get('list')
  async list() {
    const data = await this.todoService.getAll();
    return ApiResponse.success(data);
  }

  @Post('add')
  async add(@Body() dto: CreateTodoDto) {
    const success = await this.todoService.addTodo(dto as any);
    if (success) return ApiResponse.success(true);
    return ApiResponse.error('Failed to add todo');
  }

  @Post('update/:todoId')
  async update(@Param('todoId') todoId: string, @Body() dto: UpdateTodoDto) {
    const merged = { ...dto, todoId } as any;
    const success = await this.todoService.updateTodo(merged);
    if (success) return ApiResponse.success(true);
    return ApiResponse.error('Failed to update todo');
  }

  @Get('delete/:todoId')
  async delete(@Param('todoId') todoId: number) {
    const success = await this.todoService.deleteTodoMark(todoId);
    if (success) return ApiResponse.success(true);
    return ApiResponse.error('Failed to delete todo');
  }

  @Get(':todoId')
  async getById(@Param('todoId') todoId: number) {
    const todo = await this.todoService.getTodoById(todoId);
    if (todo) return ApiResponse.success(todo);
    return ApiResponse.error('Todo not found');
  }
}
