ALTER TABLE todo_list
    ADD COLUMN completed_at datetime NULL AFTER is_finished;
