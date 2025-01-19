import React, { useState, useMemo } from "react";
import { Task } from "../context/TaskContext";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";

interface TaskListProps {
  tasks: Task[];
  toggleCompletion: (id: string) => void;
  deleteTask: (id: string) => void;
  reorderTasks: (tasks: Task[]) => void;
  editTask: (id: string, updatedTask: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  toggleCompletion,
  deleteTask,
  reorderTasks,
  editTask,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState<
    "Work" | "Personal" | "Urgent"
  >("Work");
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "Work" | "Personal" | "Urgent" | "All"
  >("All");

  const API_URL = "https://my-task-manager-api.vercel.app/api";
  

  const handleEdit = (task: Task) => {
    setIsEditing(true);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditCategory(task.category);
    setEditTaskId(task._id);
  };

  const handleSaveEdit = () => {
    if (editTaskId) {
      const updatedTask = {
        _id: editTaskId,
        title: editTitle,
        description: editDescription,
        category: editCategory,
        completed: false,
      };

      // Update task on the backend
      axios
        .put(`${API_URL}/${editTaskId}`, updatedTask)
        .then(() => {
          editTask(editTaskId, updatedTask);
          setIsEditing(false);
          setEditTaskId(null);
        })
        .catch((error) => console.error("Error updating task:", error));
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTaskId(null);
  };

  const handleDragEnd = (result: any) => {
    const { source, destination } = result;

    if (!destination) return;

    const updatedTasks = Array.from(tasks);
    const [movedTask] = updatedTasks.splice(source.index, 1);
    updatedTasks.splice(destination.index, 0, movedTask);

    reorderTasks(updatedTasks);

    updatedTasks.forEach((task) => {
      axios
        .put(`${API_URL}/${task._id}`, task)
        .then(() => {
          console.log(`Task with ID ${task._id} updated successfully!`);
        })
        .catch((error) => {
          console.error(`Error updating task with ID ${task._id}:`, error);
        });
    });
  };

  // Filter tasks based on searchKeyword and selectedCategory
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        task.description.toLowerCase().includes(searchKeyword.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || task.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [tasks, searchKeyword, selectedCategory]);

  return (
    <section className="p-6 rounded-lg shadow-md max-w-md mx-auto min-h-screen 
    border bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white">
      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black
           dark:bg-darkBg dark:text-darkText"
        />
        <select
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(
              e.target.value as "Work" | "Personal" | "Urgent" | "All"
            )
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black
           dark:bg-darkBg dark:text-darkText"
        >
          <option value="All">All</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Urgent">Urgent</option>
        </select>
      </div>

      {/* Task List */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="taskList">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {filteredTasks.map((task, index) => (
                <Draggable key={task._id} draggableId={task._id} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="p-6 rounded-lg shadow-md max-w-md mx-auto h-32 border
                       bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                    >
                      <h3 className="app-container text-sm font-semibold text-black dark:text-white">
                        {task.title}
                      </h3>
                      <p className="app-container text-sm text-black dark:text-white">
                        {task.description}
                      </p>
                      <p className="app-container text-sm text-black dark:text-white">
                        Category: {task.category}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => toggleCompletion(task._id)}
                          className="px-2 py-1 text-white text-sm font-medium rounded-md 
                          transition-colors duration-300 bg-blue-500 hover:bg-blue-600
                           dark:bg-blue-400 dark:hover:bg-blue-700"
                        >
                          {task.completed ? "Ongoing" : "Completed"}
                        </button>
                        <button
                          onClick={() => deleteTask(task._id)}
                          className="px-2 py-1 text-white text-sm font-medium rounded-md transition-colors 
                          duration-300 bg-red-500 hover:bg-red-600 dark:bg-red-400 dark:hover:bg-red-700"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handleEdit(task)}
                          className="px-2 py-1 text-white text-sm font-medium rounded-md 
                          transition-colors duration-300 bg-gray-500 hover:bg-gray-600
                           dark:bg-gray-600 dark:hover:bg-gray-700"
                        >
                          Edit
                        </button>
                      </div>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Edit Task</h3>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Description"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            ></textarea>
            <select
              value={editCategory}
              onChange={(e) =>
                setEditCategory(
                  e.target.value as "Work" | "Personal" | "Urgent"
                )
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
              shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            >
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Urgent">Urgent</option>
            </select>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-500 text-white text-sm font-medium 
                rounded-md hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-500 text-white text-sm font-medium 
                rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TaskList;
