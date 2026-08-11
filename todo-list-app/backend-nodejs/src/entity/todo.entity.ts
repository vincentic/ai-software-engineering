import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn({ name: 'todo_id' ,type: 'int',comment: '主键'})
  todoId: number;

  @Column({ name: 'todo_name', type: 'varchar', nullable: false,comment: '待办项名称' })
  todoName: string;

  @Column({ name: 'due_date', type: 'datetime', nullable: false, default: () => 'CURRENT_TIMESTAMP',comment: '截止日期' })
  dueDate: Date | null;

  @Column({ name: 'is_finished', type: 'integer', default: 0,comment: '完成情况' })
  isFinished: number;

  @Column({ name: 'is_deleted', type: 'integer', default: 0,comment: '删除情况' })
  isDeleted: number;
}
