package cn.lim.todolistservice.service;

import cn.lim.todolistservice.entity.Todo;
import cn.lim.todolistservice.mapper.TodoMapper;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

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

    @Test
    void getOwnPageNormalizesPaginationAndKeyword() {
        TodoMapper todoMapper = mock(TodoMapper.class);
        TodoService todoService = new TodoService();
        ReflectionTestUtils.setField(todoService, "baseMapper", todoMapper);
        when(todoMapper.countOwnTasks("github")).thenReturn(1L);
        when(todoMapper.selectOwnTaskPage("github", 50, 0)).thenReturn(List.of(new Todo()));

        var result = todoService.getOwnPage(" github ", 0, 100);

        assertThat(result.getPage()).isEqualTo(1);
        assertThat(result.getPageSize()).isEqualTo(50);
        assertThat(result.getTotal()).isEqualTo(1);
        assertThat(result.getItems()).hasSize(1);
        verify(todoMapper).countOwnTasks("github");
        verify(todoMapper).selectOwnTaskPage("github", 50, 0);
    }

    @Test
    void addTodoSetsCreatedAtWhenMissing() {
        TodoMapper todoMapper = mock(TodoMapper.class);
        TodoService todoService = new TodoService();
        ReflectionTestUtils.setField(todoService, "baseMapper", todoMapper);
        when(todoMapper.insert(org.mockito.ArgumentMatchers.any(Todo.class))).thenReturn(1);

        Todo todo = new Todo();
        todo.setTodoName("Write tests");
        todo.setIsFinished(0);

        boolean result = todoService.addTodo(todo);

        assertThat(result).isTrue();
        assertThat(todo.getCreatedAt()).isNotNull();
    }
}
