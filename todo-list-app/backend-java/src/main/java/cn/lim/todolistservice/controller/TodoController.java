package cn.lim.todolistservice.controller;

import cn.lim.todolistservice.dto.TodoCreateRequest;
import cn.lim.todolistservice.dto.TodoUpdateRequest;
import cn.lim.todolistservice.entity.Todo;
import cn.lim.todolistservice.entity.ApiResponse;
import cn.lim.todolistservice.service.TodoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Controller 层
@RestController
@RequestMapping("/todo")
public class TodoController {
    @Autowired
    private TodoService todoService;


    @GetMapping("/list")
    public ApiResponse<List<Todo>> list() {
        return ApiResponse.success(todoService.getOwnAll());
    }

    @PostMapping("/add")
    public ApiResponse<Boolean> add(@Valid @RequestBody TodoCreateRequest request) {
        Todo todo = request.toEntity();
        boolean result = todoService.addTodo(todo);
        if (result) {
            return ApiResponse.success(true);
        } else {
            return ApiResponse.error("Failed to add todo");
        }
    }

    @PostMapping("/update/{todoId}")
    public ApiResponse<Boolean> update(@PathVariable String todoId, @Valid @RequestBody TodoUpdateRequest request) {
        Todo todo = request.toEntity(todoId);
        boolean result = todoService.updateTodo(todo);
        if (result) {
            return ApiResponse.success(true);
        } else {
            return ApiResponse.error("Failed to update todo");
        }
    }

    @GetMapping("/delete/{todoId}")
    public ApiResponse<Boolean> delete(@PathVariable String todoId) {
        boolean result = todoService.deleteTodoMark(todoId);
        if (result) {
            return ApiResponse.success(true);
        } else {
            return ApiResponse.error("Failed to delete todo");
        }
    }

    @GetMapping("/{todoId}")
    public ApiResponse<Todo> getById(@PathVariable String todoId) {
        Todo todo = todoService.getTodoById(todoId);
        if (todo != null) {
            return ApiResponse.success(todo);
        } else {
            return ApiResponse.error("Todo not found");
        }
    }
}
