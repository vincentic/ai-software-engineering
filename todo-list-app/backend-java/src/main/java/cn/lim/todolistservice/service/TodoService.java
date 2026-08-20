package cn.lim.todolistservice.service;

import cn.lim.todolistservice.entity.Todo;
import cn.lim.todolistservice.mapper.TodoMapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

/**
 * Todo 业务服务类
 * 使用 MyBatis Plus ServiceImpl 提供增强的业务处理能力
 */
@Service
public class TodoService extends ServiceImpl<TodoMapper, Todo> {



    /**
     * 获取所有待办项
     * @return 待办项列表
     */
    public List<Todo> getAll() {
        return this.list();  // 使用 MyBatis Plus 提供的 list() 方法
    }

    /**
     * 获取所有未删除的待办项
     * @return 待办项列表
     */
    public List<Todo> getOwnAll() {
        return this.baseMapper.selectOwnTasklist();
    }

    /**
     * 根据 ID 查询待办项
     * @param todoId 待办项 ID
     * @return 待办项对象
     */
    public Todo getTodoById(String todoId) {
        return this.baseMapper.selectOwnTaskById(todoId);
    }

    /**
     * 新增待办项
     * @param todo 待办项对象
     * @return 是否成功
     */
    public boolean addTodo(Todo todo) {
        if (Integer.valueOf(1).equals(todo.getIsFinished())) {
            todo.setCompletedAt(new Date());
        }
        return this.save(todo);  // 使用 MyBatis Plus 提供的 save() 方法
    }

    /**
     * 更新待办项
     * @param todo 待办项对象
     * @return 是否成功
     */
    public boolean updateTodo(Todo todo) {
        if (todo.getIsFinished() != null) {
            Date completedAt = Integer.valueOf(1).equals(todo.getIsFinished()) ? new Date() : null;
            return this.lambdaUpdate()
                    .eq(Todo::getTodoId, todo.getTodoId())
                    .set(todo.getTodoName() != null, Todo::getTodoName, todo.getTodoName())
                    .set(Boolean.TRUE.equals(todo.getDueDateProvided()), Todo::getDueDate, todo.getDueDate())
                    .set(Todo::getIsFinished, todo.getIsFinished())
                    .set(Todo::getCompletedAt, completedAt)
                    .update();
        }
        return this.updateById(todo);  // 使用 MyBatis Plus 提供的 updateById() 方法
    }

    /**
     * 删除待办项
     * @param todoId 待办项 ID
     * @return 是否成功
     */
    public boolean deleteTodo(String todoId) {
        return this.removeById(todoId);  // 使用 MyBatis Plus 提供的 removeById() 方法
    }

    /**
     * 删除待办项标记
     * @param todoId 待办项 ID
     * @return 是否成功
     */
    public boolean deleteTodoMark(String todoId) {
        // 调用自定义 mapper 方法执行逻辑删除
        int updated = this.baseMapper.markDeleted(todoId);
        return updated > 0;
    }
}
