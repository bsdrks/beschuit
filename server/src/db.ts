import { verify } from 'argon2';
import {
    type CreateTaskMutationResponse,
    type UpdateTaskMutationResponse,
    type ToggleTaskMutationResponse,
    type RemoveTaskMutationResponse,
    type Task
} from './__generated__/resolvers-types.js';
import sqlite3 from 'better-sqlite3';

export class TaskDB {
    conn: sqlite3.Database;

    constructor(path: string) {
        this.conn = sqlite3(path);

        this.createTaskTable();
        this.createUserTable();
    }

    // These should be moved to proper migrations.
    private createTaskTable(): void {
        this.conn.exec(`
            DROP TABLE IF EXISTS tasks;

            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                done INTEGER DEFAULT 0
            )
        `);
    }

    private createUserTable(): void {
        this.conn.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT,
                password TEXT
            )
        `);
    }

    public getTasks(): Task[] {
        // TODO: In production, we would avoid `as T`.
        return this.conn.prepare('SELECT * FROM tasks').all() as Task[];
    }

    /**
     * Add a task to the database.
     * @param task - The task to add.
     * @returns {boolean} Whether the task was added.
     */
    public createTask({
        title,
        done
    }: Omit<Task, 'id'>): CreateTaskMutationResponse {
        const result = this.conn
            .prepare('INSERT INTO tasks (title, done) VALUES (?, ?)')
            .run(title, done ? 1 : 0);

        return { created: result.changes > 0 };
    }

    /**
     * Remove a task from the database.
     * @param id - The ID of the task to remove.
     * @returns {boolean} Whether the task was removed.
     */
    public removeTask(id: string): RemoveTaskMutationResponse {
        const result = this.conn
            .prepare('DELETE FROM tasks WHERE id = ?')
            .run(id);

        return { removed: result.changes > 0 };
    }

    /**
     * Update a task in the database.
     * @param id - The ID of the task to update.
     * @param task - The new task data.
     * @returns {boolean} Whether the task was updated.
     */
    public updateTask(
        id: string,
        { title, done }: Omit<Task, 'id'>
    ): UpdateTaskMutationResponse {
        const result = this.conn
            .prepare('UPDATE tasks SET title = ?, done = ? WHERE id = ?')
            .run(title, done ? 1 : 0, id);

        return { updated: result.changes > 0 };
    }

    /**
     * Toggle a task's done status.
     * @param id - The ID of the task to toggle.
     * @returns {boolean} Whether the task was toggled.
     */
    public toggleTask(id: string): ToggleTaskMutationResponse {
        const result = this.conn
            .prepare('UPDATE tasks SET done = (1 - done) WHERE id = ?')
            .run(id);

        return { toggled: result.changes > 0 };
    }

    /**
     * Authenticate a user.
     * @param username - The username to authenticate.
     * @param password - The password to authenticate.
     * @returns {boolean} Whether the user was authenticated.
     */
    public async authenticate(username: string, password: string): Promise<boolean> {
        const result = this.conn
            .prepare('SELECT * FROM users WHERE username = ?')
            .get(username);

        return await verify((result as { password: string }).password, password);
    }
}
