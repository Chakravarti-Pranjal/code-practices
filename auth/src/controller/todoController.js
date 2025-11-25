import { Todo } from "../models/todoModel.js";

export const getTodos = async (req, res) => {
  try {
    const userId = req.user.id;

    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filters
    const {
      status,
      priority,
      search,
      tags,
      dueBefore,
      dueAfter,
      sortBy,
      order,
    } = req.query;

    // Build query object
    let query = { userId };

    if (status) query.status = status;
    if (priority) query.priority = priority;

    // Search in title + description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by tag
    if (tags) query.tags = { $in: tags.split(",") };

    // Due date filters
    if (dueBefore || dueAfter) {
      query.dueDate = {};
      if (dueBefore) query.dueDate.$lte = new Date(dueBefore);
      if (dueAfter) query.dueDate.$gte = new Date(dueAfter);
    }

    // Sorting
    let sort = {};
    if (sortBy) {
      sort[sortBy] = order === "desc" ? -1 : 1;
    } else {
      sort.createdAt = -1; // default: newest first
    }

    // Fetch data
    const todos = await Todo.find(query).sort(sort).skip(skip).limit(limit);

    const total = await Todo.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "data fetched successfully",
      data: todos,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addTodo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, status, priority, dueDate, tags } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const todo = await Todo.create({
      userId,
      title,
      description,
      status,
      priority,
      dueDate,
      tags,
    });

    res.status(201).json({
      message: "Todo created successfully",
      todo,
    });
  } catch (error) {
    console.error("Add Todo Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json({
      message: "Todo updated successfully",
      todo: updatedTodo,
    });
  } catch (error) {
    console.error("Update Todo Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deletedTodo = await Todo.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!deletedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json({
      message: "Todo deleted successfully",
    });
  } catch (error) {
    console.error("Delete Todo Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
