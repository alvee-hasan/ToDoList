import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
    const [page, setPage] = useState(1);
    const [task, setTask] = useState('');
    const [todos, setTodos] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [updateId, setUpdateId] = useState(null);
    const [updatedTask, setUpdatedTask] = useState('');

    const fetchTodos = () => {
        axios.get('http://localhost:5000/read-tasks')
            .then(res => setTodos(res.data))
            .catch(err => console.error('Failed to fetch todos:', err));
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    const handleInsert = (e) => {
        e.preventDefault();
        if (!task.trim()) {
            alert("Task cannot be empty!");
            return;
        }
        axios.post('http://localhost:5000/new-task', { task })
            .then(() => {
                setTask('');
                fetchTodos();
            })
            .catch(err => console.error('Failed to add task:', err));
    };

    const updateTask = () => {
        if (!updatedTask.trim()) {
            alert("Updated task cannot be empty!");
            return;
        }
        axios.post('http://localhost:5000/update-task', { updateId, updatedTask })
            .then(() => {
                setIsEdit(false);
                setUpdatedTask('');
                setUpdateId(null);
                fetchTodos();
            })
            .catch(err => console.error('Failed to update task:', err));
    };

    const handleEdit = (id, task) => {
        setIsEdit(true);
        setUpdatedTask(task);
        setUpdateId(id);
    };

    const handleDelete = (id) => {
        axios.post('http://localhost:5000/delete-task', { id })
            .then(() => fetchTodos())
            .catch(err => console.error('Failed to delete task:', err));
    };

    const handleComplete = (id) => {
        axios.post('http://localhost:5000/complete-task', { id })
            .then(() => fetchTodos())
            .catch(err => console.error('Failed to mark task as complete:', err));
    };

    const filteredTodos = todos.filter(todo => {
        if (page === 2) return todo.status === 'active';
        if (page === 3) return todo.status === 'completed';
        return true;
    });

    return (
        <div className='bg-gray-300 w-screen h-screen'>
            <div className='flex gap-2 flex-col w-screen h-screen justify-center items-center'>
                <h2 className='font-semibold text-3xl mb-3'>My ToDo List</h2>
                <div className='flex gap-4'>
                    <input
                        value={isEdit ? updatedTask : task}
                        onChange={(e) => isEdit ? setUpdatedTask(e.target.value) : setTask(e.target.value)}
                        type='text'
                        placeholder={isEdit ? 'Update Task' : 'Add Task'}
                        className='outline-none border-blue-500 rounded-md w-80'
                    />
                    <button
                        className='bg-blue-500 text-white rounded-md px-3'
                        onClick={isEdit ? updateTask : handleInsert}
                    >
                        {isEdit ? 'Update' : 'Insert'}
                    </button>
                </div>

                <div className='flex text-sm w-80 justify-evenly mt-3'>
                    <p onClick={() => setPage(1)} className={`${page === 1 ? 'text-blue-700' : 'text-black'} cursor-pointer`}>All Task</p>
                    <p onClick={() => setPage(2)} className={`${page === 2 ? 'text-blue-700' : 'text-black'} cursor-pointer`}>Active</p>
                    <p onClick={() => setPage(3)} className={`${page === 3 ? 'text-blue-700' : 'text-black'} cursor-pointer`}>Complete</p>
                </div>

                {filteredTodos.map((todo, index) => (
                    <div key={index} className='flex justify-between bg-white px-3 w-80 mt-3'>
                        <div className='flex flex-col justify-between bg-white p-4 w-full px-3'>
                            <p className='text-lg font-bold'>{todo.task}</p>
                            <p className='text-xs text-gray-500'>{new Date(todo.createdAt).toLocaleString()}</p>
                            <p className='text-sm text-gray-600'>Status: {todo.status}</p>
                        </div>
                        <div className='flex flex-col text-sm justify-start items-start p-5'>
                            <button
                                className="text-white cursor-pointer bg-orange-500 border rounded-lg w-24 p-1.5 shadow-md hover:bg-orange-600 transition-all"
                                onClick={() => handleEdit(todo.id, todo.task)}
                            >
                                Edit
                            </button>
                            <button
                                className="text-white cursor-pointer bg-red-500 border rounded-md w-24 p-1.5 shadow-sm hover:bg-red-600 transition-all"
                                onClick={() => handleDelete(todo.id)}
                            >
                                Delete
                            </button>
                            <button
                                className="text-white cursor-pointer bg-green-500 border rounded-md w-24 p-1.5 shadow-sm hover:bg-green-600 transition-all"
                                onClick={() => handleComplete(todo.id)}
                            >
                                Complete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
