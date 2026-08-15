package cn.lim.todolistservice.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.IdType;
import lombok.Data;

import java.util.Date;

@Data
@TableName("todo_list")
public class Todo {
    @TableId(type = IdType.ASSIGN_UUID)
    private String todoId;        // 主键

    @TableField("todo_name")
    private String todoName;      // 待办项名称

    @TableField("due_date")
    private Date dueDate;         // 截止日期

    @TableField("is_finished")
    private Integer isFinished;   // 完成情况 是=1 否=0

    @TableField("is_deleted")
    private Integer isDeleted;    // 删除情况 是=1 否=0

    public String getTodoId() {
        return todoId;
    }

    public void setTodoId(String todoId) {
        this.todoId = todoId;
    }

    public String getTodoName() {
        return todoName;
    }

    public void setTodoName(String todoName) {
        this.todoName = todoName;
    }

    public Date getDueDate() {
        return dueDate;
    }

    public void setDueDate(Date dueDate) {
        this.dueDate = dueDate;
    }

    public Integer getIsFinished() {
        return isFinished;
    }

    public void setIsFinished(Integer isFinished) {
        this.isFinished = isFinished;
    }

    public Integer getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(Integer isDeleted) {
        this.isDeleted = isDeleted;
    }
}

