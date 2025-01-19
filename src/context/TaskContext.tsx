import React, { createContext, useState, ReactNode, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export interface Task {
  _id: string;
  title: string;
  description: string;
  category: "Work" | "Personal" | "Urgent";
  completed: boolean;
}

interface TaskContextProps {
  tasks: Task[];
  addTask: (
    title: string,
    description: string,
    category: Task["category"]
  ) => void;
  deleteTask: (id: string) => void;
  toggleCompletion: (id: string) => void;
  reorderTasks: (updatedTasks: Task[]) => void;
  editTask: (id: string, updatedTask: Task) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const TaskContext = createContext<TaskContextProps | undefined>(
  undefined
);
export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const API_URL = "https://my-task-manager-api.vercel.app/api/tasks";
    
    useEffect(() => {
      axios
        .get(API_URL)
        .then((response) => {
          setTasks(response.data);
        })
        .catch((error) => console.error("Error fetching tasks:", error));
    }, []);
  
    const addTask = (
      title: string,
      description: string,
      category: Task["category"]
    ) => {
      axios
        .post(API_URL, { title, description, category, completed: false })
        .then((response) => {
          const newTasks = [...tasks, response.data];
          setTasks(newTasks);
          Swal.fire({
            icon: "success",
            title: "Task Added",
            text: "Your task has been added successfully!",
            timer: 2000,
            showConfirmButton: false,
          });
        })
        .catch((error) => {
          console.error("Error adding task:", error);
          Swal.fire({
            icon: "error",
            title: "Failed to Add Task",
            text: "An error occurred while adding the task.",
          });
        });
    };
  
    const deleteTask = (_id: string) => {
      console.log("Deleting task with ID:", _id); // Debugging
      axios
        .delete(`${API_URL}/${_id}`)
        .then(() => {
          const updatedTasks = tasks.filter((task) => task._id !== _id);
          setTasks(updatedTasks);
          localStorage.setItem("tasks", JSON.stringify(updatedTasks));
          Swal.fire({
            icon: "success",
            title: "Task Deleted",
            text: "The task has been deleted successfully!",
            timer: 2000,
            showConfirmButton: false,
          });
        })
        .catch((error) => {
          console.error("Error deleting task:", error);
          Swal.fire({
            icon: "error",
            title: "Failed to Delete Task",
            text: "An error occurred while deleting the task.",
          });
        });
    };
    
  
    const toggleCompletion = (id: string) => {
      axios
        .patch(`${API_URL}/${id}/completed`)
        .then((response) => {
          const updatedTasks = tasks.map((task) =>
            task._id === id ? response.data : task
          );
          setTasks(updatedTasks);
          Swal.fire({
            icon: "success",
            title: "Task Updated",
            text: "Task completion status has been toggled!",
            timer: 2000,
            showConfirmButton: false,
          });
        })
        .catch((error) => {
          console.error("Error toggling task completion:", error);
          Swal.fire({
            icon: "error",
            title: "Failed to Toggle Task",
            text: "An error occurred while toggling the task.",
          });
        });
    };
  
    const editTask = (id: string, updatedTask: Task) => {
      axios
        .put(`${API_URL}/${id}`, updatedTask)
        .then((response) => {
          const updatedTasks = tasks.map((task) =>
            task._id === id ? response.data : task
          );
          setTasks(updatedTasks);
          Swal.fire({
            icon: "success",
            title: "Task Edited",
            text: "The task has been updated successfully!",
            timer: 2000,
            showConfirmButton: false,
          });
        })
        .catch((error) => {
          console.error("Error editing task:", error);
          Swal.fire({
            icon: "error",
            title: "Failed to Edit Task",
            text: "An error occurred while editing the task.",
          });
        });
    };
  
    const reorderTasks = (updatedTasks: Task[]) => {
      setTasks(updatedTasks);
      updatedTasks.forEach((task) => {
        axios.put(`${API_URL}/${task._id}`, task).catch((error) => {
          console.error(`Error updating task with ID ${task._id}:`, error);
        });
      });
    };
  
    useEffect(() => {
      const storedDarkMode = localStorage.getItem("darkMode");
      if (storedDarkMode) {
        setDarkMode(JSON.parse(storedDarkMode));
      }
    }, []);
  
    const toggleDarkMode = () => {
      const newMode = !darkMode;
      setDarkMode(newMode);
      localStorage.setItem("darkMode", JSON.stringify(newMode));
    };
  
    return (
      <TaskContext.Provider
        value={{
          tasks,
          addTask,
          deleteTask,
          toggleCompletion,
          reorderTasks,
          editTask,
          darkMode,
          toggleDarkMode,
        }}
      >
        {children}
      </TaskContext.Provider>
    );
  };
  
