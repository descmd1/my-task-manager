import React, { useState, useContext, useEffect } from "react";
import Header from "./components/Header";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import { TaskProvider, TaskContext } from "./context/TaskContext";

const App: React.FC = () => {
  const {
    tasks,
    addTask,
    deleteTask,
    toggleCompletion,
    reorderTasks,
    editTask,
    darkMode,
    toggleDarkMode,
  } = useContext(TaskContext)!;

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <TaskProvider>
      <div
        className={`min-h-screen ${
          darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        {/* Header */}
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

        {/* Main Content */}

        <main
          className={`pt-24 p-6 container mx-auto flex flex-col items-center ${
            darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
          }`}
        >
          {/* Add Task Button */}
          <button
            className="px-4 py-2 text-white text-sm font-medium rounded-md 
            transition-colors duration-300 bg-blue-500 hover:bg-blue-600
             dark:bg-blue-400 dark:hover:bg-blue-700 mb-3 mt-4"
            onClick={() => setShowModal(true)}
          >
            Add Task
          </button>

          {/* TaskForm Modal */}
          {showModal && (
            <div
              className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50"
              onClick={() => setShowModal(false)}
            >
              <div
                className="p-6 rounded-lg shadow-md max-w-md mx-auto border bg-gray-100
                 text-gray-900 dark:bg-gray-800 dark:text-white mt-16"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="flex w-full justify-end mb-4 text-black py-2 px-4 rounded-md  
                  transition duration-200 dark:text-white"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                <TaskForm addTask={addTask} />
              </div>
            </div>
          )}

          {/* Task List */}
          <TaskList
            tasks={tasks}
            deleteTask={deleteTask}
            toggleCompletion={toggleCompletion}
            reorderTasks={reorderTasks}
            editTask={editTask}
          />
        </main>
      </div>
    </TaskProvider>
  );
};

export default App;
