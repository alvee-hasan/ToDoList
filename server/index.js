const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tasks',
});

db.connect((err) => {
    if (!err) {
        console.log('Connected successfully to the database');
    } else {
        console.error('Database connection failed:', err);
    }
});

// Add a new task
app.post('/new-task', (req, res) => {
    const { task } = req.body;

    if (!task) {
        return res.status(400).json({ message: 'Task is required' });
    }

    const query = 'INSERT INTO todos (task, createdAt, status) VALUES (?, ?, ?)';
    const taskDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    db.query(query, [task, taskDate, 'active'], (err, result) => {
        if (err) {
            console.error('Failed to insert task:', err);
            return res.status(500).json({ message: 'Failed to add task' });
        }
        res.status(201).json({ message: 'Task added successfully' });
    });
});

// Get all tasks
app.get('/read-tasks', (req, res) => {
    const query = 'SELECT * FROM todos';

    db.query(query, (err, result) => {
        if (err) {
            console.error('Failed to fetch tasks:', err);
            return res.status(500).json({ message: 'Failed to fetch tasks' });
        }
        else{
            console.log('Got Tasks');
            
        }
        res.status(200).json(result);
    });
});

// Update a task
app.post('/update-task', (req, res) => {
    const { updatedTask, updateId } = req.body;

    if (!updatedTask || !updateId) {
        return res.status(400).json({ message: 'Updated task and ID are required' });
    }

    const query = 'UPDATE todos SET task = ? WHERE id = ?';

    db.query(query, [updatedTask, updateId], (err, result) => {
        if (err) {
            console.error('Failed to update task:', err);
            return res.status(500).json({ message: 'Failed to update task' });
        }
        res.status(200).json({ message: 'Task updated successfully' });
    });
});

// Delete a task
app.post('/delete-task', (req, res) => {
    const q = 'delete from todos where id = ?'
    db.query(q, [req.body.id], (err, result)=>{
        if(err){
            console.log('Failed to delete!');
        }
        else{
            console.log('Deleted!!');
            db.query('select * from todos', (e, newList)=>{
                res.send(newList);
            })
            
        }
    })
})

// Complete Task
app.post('/complete-task', (req, res)=>{
    const q = 'UPDATE todos SET status = ? WHERE id = ?';
    db.query(q, ['completed', req.body.id], (err, result)=>{
        if(result){
            db.query('select * from todos', (e, newList)=>{
                res.send(newList);
            })
        }
    })
})


// Start the server
app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});
