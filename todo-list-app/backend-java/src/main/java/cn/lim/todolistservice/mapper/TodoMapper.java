package cn.lim.todolistservice.mapper;

import cn.lim.todolistservice.entity.Todo;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Todo 表 Mapper 接口
 * 继承 BaseMapper 自动获得 CRUD 基础功能
 */
@Mapper
public interface TodoMapper extends BaseMapper<Todo> {


    /**
     * 查询未删除的task列表
     * @return 结果行数
     */
    List<Todo> selectOwnTasklist();

    /**
     * 根据 ID 查询未删除的待办项
     * @param todoId 待办项 ID
     * @return 未删除的待办项
     */
    Todo selectOwnTaskById(@Param("todoId") String todoId);

    /**
     * 标记待办项为已删除（逻辑删除）
     * @param todoId 待办项 ID
     * @return 受影响的行数
     */
    int markDeleted(@Param("todoId") String todoId);

    // MyBatis Plus 自动提供的方法：
    // insert - 插入
    // deleteById - 根据ID删除
    // update - 更新
    // selectById - 根据ID查询
    // selectList - 查询列表
    // selectCount - 查询总数
    // 等更多通用方法
}
