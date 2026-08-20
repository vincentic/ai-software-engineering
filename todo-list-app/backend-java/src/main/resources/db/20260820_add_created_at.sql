ALTER TABLE todo_list
    ADD COLUMN created_at datetime NULL AFTER due_date;

UPDATE todo_list
SET created_at = COALESCE(created_at, due_date, completed_at, NOW())
WHERE created_at IS NULL;
