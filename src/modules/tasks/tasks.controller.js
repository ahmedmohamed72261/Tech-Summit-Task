// files imports
import Tasks from '../../../DB/models/tasks.model.js';
import { paginationFunction } from '../../utils/pagination.js';

// ======================== add task api ======================== //
/*
    // 1 - destructing the required data
    // 2 - destructing the id if the signed in user
    // 3 - create the new task object
    // 4 - create a new task in the database
    // 5 - check if the task document created
    // 6 - return the response
*/

export const addTask = async (req, res, next) => {
    // 1 - destructing the required data
    const {
        title,
        TextBody,
        ListBody,
        accessSpecifier
    } = req.body;

    const { categoryId } = req.query;

    // 2 - destructing the id if the signed in user
    const { _id } = req.authUser;
    // 3 - create the new task object
    const newTaskData = {
        title,
        TextBody,
        ListBody,
        categoryId,
        accessSpecifier,
        createdBy: _id
    };

    // 4 - create a new task in the database
    const newTask = await Tasks.create(newTaskData);

    // 5 - check if the task document created
    if (!newTask) {
        return next(new Error('Failed to create task', { cause: 500 }));
    }

    // 6 - return the response
    res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: newTask
    });
}


// =================================== update task api ============================ //

/*
    // 1 - destructing the required data
    // 2 - destructing the id if the signed in user
    // 3 - find the task by id and update it
    // 4 - check if the task is updated
    // 5 - return the response
*/

export const updateTask = async (req, res, next) => {
    // 1 - destructing the required data
    const {
        newTitle,
        newTextBody,
        newListBody,
        newAccessSpecifier
    } = req.body;

    const { taskId } = req.query;
    // 2 - destructing the id if the signed in user
    const { _id } = req.authUser;

    // 3 - find the task by id and update it
    const updatedTask = await Tasks.findOneAndUpdate(
        { _id: taskId, createdBy: _id },
        {
            title: newTitle,
            TextBody: newTextBody,
            ListBody: newListBody,
            accessSpecifier: newAccessSpecifier
        },
        {new:true}
    );
    // 4 - check if the task is updated
    if(!updatedTask){
        return next(new Error(`task not found`,{cause:404}));
    }
    // 5 - return the response
    return res.status(200).json({
        success:true,
        message:"task updated successfully",
        data:updatedTask
    })
}

// ============================= delete task api ========================== //

/*
    // 1 - destructing the id of the task in query
    // 2 - destructing the id of the signed in user
    // 3 - find the task by id and delete it
    // 4 - check if the task was found and deleted
    // 5 - return the response
*/

export const deleteTask = async (req, res, next) => {
    // 1 - destructing the id of the task in query
    const { taskId } = req.query;
    // 2 - destructing the id of the signed in user
    const { _id } = req.authUser;
    // 3 - find the task by id and delete it
    const deletedTask = await Tasks.findOneAndDelete({ _id: taskId, createdBy: _id });
    // 4 - check if the task was found and deleted
    if (!deletedTask) {
        return next(new Error('Failed to delete task', { cause: 404 }));
    }
    // 5 - return the response
    res.status(200).json({
        success: true,
        message: 'Task deleted successfully',
        data: deletedTask
    });
}

// ============================= get all public tasks api ========================== //

/* 
    // 1 - destructing the required data
    // 2 - get all public tasks from DB using pagination 
    // 3 - check if there are no tasks's in DB
    // 4 - return the response
*/

export const getAllPublicTasks = async (req, res, next) => {
    // 1 - destructing the required data
    const {page,size} = req.query;
    const {limit,skip} = paginationFunction({page,size})
    // 2 - get all public tasks from DB using pagination 
    const publicTasks = await Tasks.find({ accessSpecifier: 'public' }).limit(limit).skip(skip);
    // 3 - check if there are no tasks's in DB
    if (!publicTasks.length) {
        return next(new Error('No tasks found', { cause: 404 }));
    }
    // 4 - return the response
    res.status(200).json({
        success: true,
        message: 'tasks fetched successfully',
        data: publicTasks
    });
}

// ============================ get private tasks for the creator api ================= //
/* 
    // 1 - destructing the id of the signed in user
    // 2 - search for tasks in DB
    // 3 - check if there is no tasks
    // 4 - return the response
*/

export const getPrivateTasks = async (req, res, next) => {
    // 1 - destructing the id of the signed in user
    const { _id } = req.authUser;
    // 2 - search for tasks in DB
    const privatTasks = await Tasks.find({
        accessSpecifier: 'private',
        createdBy: _id
    });
    // 3 - check if there is no tasks
    if (!privatTasks.length) {
        return next(new Error('No tasks found', { cause: 404 }));
    }
    // 4 - return the response
    res.status(200).json({
        success: true,
        message: 'tasks fetched successfully',
        data: privatTasks
    });
}

