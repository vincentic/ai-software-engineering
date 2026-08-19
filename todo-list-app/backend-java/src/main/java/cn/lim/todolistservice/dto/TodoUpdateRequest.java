package cn.lim.todolistservice.dto;

import cn.lim.todolistservice.entity.Todo;
import com.fasterxml.jackson.annotation.JsonSetter;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

import java.util.Date;

public class TodoUpdateRequest {
    private String todoName;

    private Date dueDate;
    private boolean dueDateProvided;

    @Min(value = 0, message = "isFinished must be 0 or 1")
    @Max(value = 1, message = "isFinished must be 0 or 1")
    private Integer isFinished;

    public String getTodoName() {
        return todoName;
    }

    public void setTodoName(String todoName) {
        this.todoName = todoName;
    }

    public Date getDueDate() {
        return dueDate;
    }

    @JsonSetter("dueDate")
    public void setDueDate(Date dueDate) {
        this.dueDate = dueDate;
        this.dueDateProvided = true;
    }

    public boolean isDueDateProvided() {
        return dueDateProvided;
    }

    public Integer getIsFinished() {
        return isFinished;
    }

    public void setIsFinished(Integer isFinished) {
        this.isFinished = isFinished;
    }

    public Todo toEntity(String todoId) {
        Todo todo = new Todo();
        todo.setTodoId(todoId);
        todo.setTodoName(todoName);
        todo.setDueDate(dueDate);
        todo.setDueDateProvided(dueDateProvided);
        todo.setIsFinished(isFinished);
        return todo;
    }
}
