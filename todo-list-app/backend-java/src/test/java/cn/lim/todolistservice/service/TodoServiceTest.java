package cn.lim.todolistservice.service;

import cn.lim.todolistservice.entity.Todo;
import cn.lim.todolistservice.mapper.TodoMapper;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class TodoServiceTest {
    @Test
    void getTodoByIdOnlyReturnsOwnUndeletedTask() {
        TodoMapper todoMapper = mock(TodoMapper.class);
        TodoService todoService = new TodoService();
        ReflectionTestUtils.setField(todoService, "baseMapper", todoMapper);

        Todo todo = new Todo();
        todo.setTodoId("todo-1");
        when(todoMapper.selectOwnTaskById("todo-1")).thenReturn(todo);

        Todo result = todoService.getTodoById("todo-1");

        assertThat(result).isSameAs(todo);
        verify(todoMapper).selectOwnTaskById("todo-1");
    }
}
