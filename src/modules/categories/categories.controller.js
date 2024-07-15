// files imports
import Category from '../../../DB/models/category.model.js';
import Tasks from '../../../DB/models/tasks.model.js';
// =================== add category api ======================= //
/*
    // 1 - destructing the required data
    // 2 - destructing the id of the signed in user
    // 3 - check if the category is already exist
    // 4 - check if the type intered is invalid type
    // 5 - create a new category object
    // 6 - save the new category to the database
    // 7 - check if the category document created 
    // 8 - return response
*/

export const addCategory = async (req, res, next) => {
    // 1 - destructing the required data
    const { categoryType, name } = req.body;
    // 2 - destructing the id of the signed in user 
    const { _id } = req.authUser;
    // 3 - check if the category is already exist
    const isCategoryExist = await Category.findOne({ categoryType, owner: _id });
    if (isCategoryExist) {
        return next(new Error(`Category with type "${categoryType}" already exist`, { cause: 409 }));
    }
    // 4 - check if the type intered is invalid type
    if (categoryType !== 'To Do' && categoryType !== 'In Progress' && categoryType !== 'Done') {
        return next(new Error(`category type should be To Do ,In Progress or Done`, { cause: 400 }));
    }
    // 5 - create a new category object
    const newCategoryData = {
        categoryType,
        name,
        owner: _id
    };
    // 6 - save the new category to the database
    const newCategory = await Category.create(newCategoryData);
    // 7 - check if the category document created 
    if (!newCategory) {
        return next(new Error('Failed to create category', { cause: 500 }));
    }
    // 8 - return response
    res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: newCategory
    });
}

// ======================================== update category api ============================ //
/*
    // 1 - destructing the required data
    // 2 - destructing the id of the signed in user
    // 3 - find the category by id and update it
    // 4 - check if the category was found and updated
    // 5 - return the response
*/

export const updateCategory = async (req, res, next) => {
    // 1 - destructing the required data
    const { newName } = req.body;
    const { categoryId } = req.params;
    // 2 - destructing the id of the signed in user
    const { _id } = req.authUser;
    // 3 - find the category by id and update it
    const category = await Category.findOneAndUpdate({
        _id: categoryId,
        owner: _id
    }, {
        name: newName
    }, { new: true });
    // 4 - check if the category was found and updated
    if (!category) {
        return next(new Error('Category not found', { cause: 404 }));
    }
    // 5 - return the response
    res.status(200).json({
        success: true,
        message: 'Category updated successfully',
        data: category
    });

}

// ============================ delete category api ========================= //
/*
    // 1 - destructing the required data
    // 2 - destructing the id of the signed in user
    // 3 - find the category by id and delete it
    // 4 - find all related tasks and delete them 
    // 5 - check if all related tasks and deleted
    // 6 - check if the category was found and deleted
    // 7 - return the response

*/
export const deleteCategory = async (req, res, next) => {
    // 1 - destructing the required data
    const { categoryId } = req.params;
    // 2 - destructing the id of the signed in user
    const { _id } = req.authUser;
    // 3 - find the category by id and delete it
    const category = await Category.findOneAndDelete({ _id: categoryId, owner: _id });
    // 4 - find all related tasks and delete them 
    const deleteRelatedTasks = await Tasks.deleteMany({ categoryId });
    // 5 - check if all related tasks and deleted
    if (!deleteRelatedTasks) {
        return next(new Error('Failed to delete related tasks', { cause: 500 }));
    }
    // 6 - check if the category was found and deleted
    if (!category) {
        return next(new Error('Category not found', { cause: 404 }));
    }
    // 7 - return the response
    res.status(200).json({
        success: true,
        message: 'category deleted successfully',
        data: category
    });
}

// ============================ get all categories with related tasks for a specific user api ========================= //
/*
    // 1 - destructing the id of the signedIn user
    // 2 - find all categories for the signedIn user 
    // 3 - check if there if categories
    // 4 - return the response
*/

export const getAllCategories = async (req, res, next) => {
    // 1 - destructing the id of the signedIn user
    const { _id } = req.authUser;
    // 2 - find all categories for the signedIn user 
    const allCategories = await Category.find({ owner: _id }).populate([{
        path: 'Tasks'
    }]);

    // 3 - check if there if categories
    if (!allCategories.length) {
        return next(new Error('No categories found', { cause: 404 }));
    }
    // 4 - return the response
    res.status(200).json({
        success: true,
        message: 'categories fetched successfully',
        data: allCategories
    });
}

// ============================ get category name api ========================= //
/*
    // 1 - destructing the required data
    // 2 - find the required category by it's name 
    // 3 - check if there is no categories with that name
    // 4 - return the response
*/

export const getCategoryByName = async (req, res, next) => {
    // 1 - destructing the required data
    const {name} = req.body;
    // 2 - find the required category by it's name 
    const findCategory = await Category.findOne({ name })

    // 3 - check if there is no categories with that name
    if (!findCategory) {
        return next(new Error('category Not found', { cause: 404 }));
    }
    // 4 - return the response
    res.status(200).json({
        success: true,
        message: 'categories fetched successfully',
        data: findCategory
    });
}