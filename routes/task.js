const express = require('express');
const router = express.Router();

const Task = require('../models/task');

//Get all tasks

router.get('/', async(req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });        
    }
});

//Create a new task

router.post('/', async(req, res) => {
    const task = new Task({
        title: req.body.title,
        description: req.body.description
    });

    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ message: error.message });        
    }
});

//creating middleware for our :id routes
async function getTask(req,res,next){
    let task;
    try{
        task = await Task.findById(req.params.id);

        if(task === null)
        {
            return res.status(404).json({ message: 'take not found;'})
        }
    }
    catch(error){
        return res.status(500).json({message: error.message})
    }
    res.task = task;
    next();
}

//Get a specific tasks.
router.get('/:id',async(req,res)=>{
    res.json(res.task)
});

//Update a specific task by "id".
router.patch('/:id',getTask,async(req,res)=>{
    if(req.body.title != null){
        res.task.title = req.body.title;
    }
    if(req.body.description != null){
        res.task.description = req.body.description;
    }
    try {
        const updateTask = await res.task.save();
        res.json(updateTask);
    } catch (error) {
        res.status(400).json({message:error.message})
    }
});

//Delete a specific task by "id".

router.delete('/:id',getTask,async(req,res)=>{
    try {
        await res.task.remove();
        res.json({message: "task deleted"});
    } catch (error) {
        res.status(500).json({message:error.message})
    }
});

module.exports = router;