import './App.css';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Task } from 'types';

function App() {
    let titleInput: HTMLInputElement;

    const { loading, error, data } = useQuery(
        gql`
            query ReadTasks {
                readTasks {
                    id
                    title
                    done
                }
            }
        `,
        {
            // This is very lazy of me :)
            pollInterval: 500
        }
    );

    const [addTask] = useMutation(gql`
        mutation CreateTask($task: CreateTaskInput!) {
            createTask(task: $task) {
                created
            }
        }
    `);

    const [removeTask] = useMutation(gql`
        mutation RemoveTask($id: ID!) {
            removeTask(id: $id) {
                removed
            }
        }
    `);

    const [toggleTask] = useMutation(gql`
        mutation ToggleTask($id: ID!) {
            toggleTask(id: $id) {
                toggled
            }
        }
    `);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <div className="app">
            <h1>TODO</h1>
            <ul>
                {data.readTasks.map((task: Task) => (
                    <li key={task.id}>
                        <input
                            type="checkbox"
                            checked={task.done}
                            onClick={(e) => {
                                e.preventDefault();

                                toggleTask({
                                    variables: {
                                        id: task.id
                                    }
                                });
                            }}
                        />
                        <h2>{task.title}</h2>
                        <button
                            onClick={(e) => {
                                e.preventDefault();

                                removeTask({
                                    variables: {
                                        id: task.id
                                    }
                                });
                            }}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
            <div>
                <h3>Add task</h3>
                <form
                    className="add-task"
                    onSubmit={(e) => {
                        e.preventDefault();

                        addTask({
                            variables: {
                                task: {
                                    title: titleInput.value,
                                    done: false
                                }
                            }
                        });

                        titleInput.value = '';
                    }}
                >
                    <input
                        type="text"
                        placeholder="Task title&hellip;"
                        ref={(node) => {
                            if (node !== null) {
                                titleInput = node;
                            }
                        }}
                    />
                    <button type="submit">Add</button>
                </form>
            </div>
        </div>
    );
}

export default App;
