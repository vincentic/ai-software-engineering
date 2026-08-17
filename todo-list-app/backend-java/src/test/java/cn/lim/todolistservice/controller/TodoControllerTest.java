package cn.lim.todolistservice.controller;

import cn.lim.todolistservice.service.TodoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
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
}
