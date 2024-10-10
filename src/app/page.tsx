// app/page.tsx

"use client";

import { useState, useEffect } from "react";
import { TypeTodo } from "@/types";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { SignedIn } from "@clerk/nextjs";

import TodoDashboard from "@/components/TodoDashboard";

export default function Home() {
  const [todos, setTodos] = useState<TypeTodo[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");
  const [newPriority, setNewPriority] = useState<"Medium" | "Low" | "High">("Medium");
  const [newCategory, setNewCategory] = useState<string>("");
  const [newDueDate, setNewDueDate] = useState<Date | null>(new Date());

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [addTodoLoading, setAddTodoLoading] = useState<boolean>(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentTodo, setCurrentTodo] = useState<TypeTodo | null>(null);

  // Toast state
  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastSeverity, setToastSeverity] = useState<"success" | "error">("success");

  // Fetch all todos on initial load
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/todos");
      const data = await res.json();
      setTodos(data.todos);
      setLoading(false);
      setError(false);
    } catch (error) {
      console.error(error);
      setError(true);
      setLoading(false);
      showToast("Failed to fetch tasks", "error");
    }
  };

  const handleCreateTodo = async () => {
    if (!newTodo.trim()) {
      showToast("Task cannot be empty", "error");
      return;
    }

    try {
      setAddTodoLoading(true);
      const res = await fetch("/api/todos/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTodo,
          priority: newPriority,
          category: newCategory,
          completed: false,
          dueDate: newDueDate ? new Date(newDueDate).toISOString() : null
        }),
      });

      const data = await res.json();
      console.log("data: ", data)
      setTodos([...todos, data.todo]);
      setNewTodo("");
      setNewPriority("Medium");
      setNewCategory("");
      showToast("Task added successfully!", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to add task", "error");
    } finally {
      setAddTodoLoading(false);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      setTodos(todos.filter((todo) => todo.id !== id));

      await fetch(`/api/todos/delete?todoID=${id}`, {
        method: "DELETE",
      });

      showToast("Task deleted successfully!", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to delete task", "error");
    }
  };

  const handleToggleComplete = async (id: number) => {
    try {
      const updatedTodos = todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
      setTodos(updatedTodos);

      const updatedTodo = updatedTodos.find((todo) => todo.id == id)

      console.log(updatedTodo);

      await fetch(`/api/todos/update?todoID=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTodo),
      });
    } catch (error) {
      console.error(error);
      showToast("Failed to update task", "error");
    }
  };

  const handleUpdateTodo = async (updatedTodo: TypeTodo) => {
    try {
      const updatedTodos = todos.map((todo) =>
        todo.id === updatedTodo.id ? updatedTodo : todo
      );
      setTodos(updatedTodos);

      await fetch(`/api/todos/update?todoID=${updatedTodo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTodo),
      });

      showToast("Task updated successfully!", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to update task", "error");
    } finally {
      setEditModalOpen(false)
      setCurrentTodo(null)
    }
  };

  // Function to show toast
  const showToast = (message: string, severity: "success" | "error") => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  // Function to close the toast
  const handleCloseToast = () => {
    setToastOpen(false);
  };

  return (
    <div className="container min-w-full p-4 bg-[#F5F5F5] dark:bg-[#1C1C1C] text-[#2f2a29] dark:text-[#F5F5F5] min-h-screen">
      {/* Snackbar for toast messages */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseToast} severity={toastSeverity} sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar>
      <SignedIn>
        <TodoDashboard
          todos={todos}
          loading={loading}
          error={error}
          newTodo={newTodo}
          setNewTodo={setNewTodo}
          handleCreateTodo={handleCreateTodo}
          addTodoLoading={addTodoLoading}
          newPriority={newPriority}
          setNewPriority={setNewPriority}
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          handleDeleteTodo={handleDeleteTodo}
          handleUpdateTodo={handleUpdateTodo}
          handleToggleComplete={handleToggleComplete}
          newDueDate={newDueDate}
          setNewDueDate={setNewDueDate}
        />
      </SignedIn>
    </div>
  );
}
