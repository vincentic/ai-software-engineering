package cn.lim.todolistservice.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.IdType;
import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @JsonIgnore
    @TableField(exist = false)
    private Boolean dueDateProvided; // 更新时是否显式传入截止日期

    @TableField("is_finished")
    private Integer isFinished;   // 完成情况 是=1 否=0

    @TableField("completed_at")
    private Date completedAt;     // 完成日期

    @TableField("is_deleted")
    private Integer isDeleted;    // 删除情况 是=1 否=0
}
