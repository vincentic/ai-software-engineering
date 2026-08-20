package cn.lim.todolistservice.controller;

import cn.lim.todolistservice.entity.Todo;
import cn.lim.todolistservice.service.TodoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TodoController.class)
class TodoControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TodoService todoService;

    @Test
    void addReturnsSuccessWhenRequestIsValid() throws Exception {
        when(todoService.addTodo(any())).thenReturn(true);

        mockMvc.perform(post("/todo/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"todoName\":\"Write tests\",\"isFinished\":0}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data").value(true))
                .andExpect(jsonPath("$.message").value("success"));
    }

    @Test
    void addReturnsBadRequestWhenTodoNameIsBlank() throws Exception {
        mockMvc.perform(post("/todo/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"todoName\":\" \",\"isFinished\":0}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.message").value("todoName cannot be blank"));
    }

    @Test
    void updateAllowsStatusOnlyRequest() throws Exception {
        when(todoService.updateTodo(any())).thenReturn(true);

        mockMvc.perform(post("/todo/update/todo-1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"isFinished\":1}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data").value(true))
                .andExpect(jsonPath("$.message").value("success"));
    }

    @Test
    void updatePreservesDueDateWhenFieldIsMissing() throws Exception {
        when(todoService.updateTodo(argThat(todo -> Boolean.FALSE.equals(todo.getDueDateProvided())))).thenReturn(true);

        mockMvc.perform(post("/todo/update/todo-1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"todoName\":\"Write tests\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data").value(true));
    }

    @Test
    void updateCanClearDueDateWhenFieldIsNull() throws Exception {
        when(todoService.updateTodo(argThat(todo -> Boolean.TRUE.equals(todo.getDueDateProvided()) && todo.getDueDate() == null))).thenReturn(true);

        mockMvc.perform(post("/todo/update/todo-1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"dueDate\":null}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data").value(true));
    }

    @Test
    void listDoesNotExposeInternalDueDateFlag() throws Exception {
        Todo todo = new Todo();
        todo.setTodoId("todo-1");
        todo.setTodoName("Write tests");
        todo.setIsFinished(0);
        todo.setIsDeleted(0);
        todo.setDueDateProvided(true);
        when(todoService.getOwnPage(null, 1, 10)).thenReturn(new cn.lim.todolistservice.dto.TodoPageResponse(List.of(todo), 1, 1, 10));

        mockMvc.perform(get("/todo/list"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.items[0].todoId").value("todo-1"))
                .andExpect(jsonPath("$.data.items[0].dueDateProvided").doesNotExist());
    }

    @Test
    void listAcceptsSearchAndPaginationParams() throws Exception {
        when(todoService.getOwnPage("github", 2, 5)).thenReturn(new cn.lim.todolistservice.dto.TodoPageResponse(List.of(), 0, 2, 5));

        mockMvc.perform(get("/todo/list")
                        .param("keyword", "github")
                        .param("page", "2")
                        .param("pageSize", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.page").value(2))
                .andExpect(jsonPath("$.data.pageSize").value(5));
    }
}
