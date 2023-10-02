import {
    type CreateTaskMutationResponse,
    type RemoveTaskMutationResponse,
    type ToggleTaskMutationResponse,
    type UpdateTaskMutationResponse,
    type Task
} from '__generated__/resolvers-types.js';
import { TaskDB } from './db.js';
import { hash } from 'argon2';

const db = new TaskDB('./tasks.db');

// We assume a single dummy user. This should be moved to proper migrations.
await (async () => {
    const password = await hash('admin');

    db.conn
        .prepare('INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)')
        .run('admin', password);
})();

export const resolvers = (db: TaskDB): {
    Query: {
        readTasks: () => Task[];
    },
    Mutation: {
        createTask: (
            _: unknown,
            { task }: { task: Omit<Task, 'id'> }
        ) => CreateTaskMutationResponse,
        removeTask: (
            _: unknown,
            { id }: Pick<Task, 'id'>
        ) => RemoveTaskMutationResponse,
        updateTask: (
            _: unknown,
            { id, task }: { id: string; task: Omit<Task, 'id'> }
        ) => UpdateTaskMutationResponse,
        toggleTask: (
            _: unknown,
            { id }: Pick<Task, 'id'>
        ) => ToggleTaskMutationResponse
    }
} => {
    return {
        Query: {
            readTasks: () => db.getTasks()
        },
        Mutation: {
            createTask: (
                _: unknown,
                { task }: { task: Omit<Task, 'id'> }
            ): CreateTaskMutationResponse => db.createTask(task),
            removeTask: (
                _: unknown,
                { id }: Pick<Task, 'id'>
            ): RemoveTaskMutationResponse => db.removeTask(id),
            updateTask: (
                _: unknown,
                { id, task }: { id: string; task: Omit<Task, 'id'> }
            ): UpdateTaskMutationResponse => db.updateTask(id, task),
            toggleTask: (
                _: unknown,
                { id }: Pick<Task, 'id'>
            ): ToggleTaskMutationResponse => db.toggleTask(id)
        }
    };
};
