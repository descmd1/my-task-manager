import React, { useState } from 'react';
import { Task } from '../context/TaskContext';

interface TaskFormProps {
  addTask: (title: string, description: string, category: Task['category']) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ addTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Task['category']>('Work');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTask(title, description, category);
    setTitle('');
    setDescription('');
  };

  return (
    <section
      className="p-6 rounded-lg shadow-md max-w-md mx-auto border
       bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Field */}
        <div className='flex flex-col gap-2 items-start w-full'>
          <label
            htmlFor="title"
           className="app-container text-sm font-semibold text-black dark:text-white"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
            focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white
             text-black dark:bg-gray-800 dark:text-darkText"
          />
        </div>

        {/* Description Field */}
        <div className='flex flex-col gap-2 items-start w-full'>
          <label
            htmlFor="description"
             className="app-container text-sm font-semibold text-black dark:text-white"
          >
            Description
          </label>
          <textarea
            id="description"
            placeholder="Enter task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
            focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black
             dark:bg-gray-800 dark:text-darkText"
          ></textarea>
        </div>

        {/* Category Field */}
        <div className='flex flex-col gap-2 items-start w-full'>
          <label
            htmlFor="category"
           className="app-container text-sm font-semibold text-black dark:text-white"
          >
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as Task['category'])}
           className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
           focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white
            text-black dark:bg-gray-800 dark:text-darkText"
          >
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
           className="w-full py-2 text-white text-sm font-medium 
           rounded-md transition-colors duration-300 bg-blue-500 hover:bg-blue-600
            dark:bg-blue-400 dark:hover:bg-blue-700"
        >
          Add Task
        </button>
      </form>
    </section>
  );
};

export default TaskForm;
